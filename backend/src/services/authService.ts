import bcrypt from 'bcrypt';
import { prisma } from '../models/index';
import { generateToken } from '../utils/jwt';
import { EmailService } from './emailService';
import { TeamGenerationJob } from '../jobs/teamGeneration';
import {
  LoginRequest,
  UnifiedAuthResponse,
  TeamGenerationStatus,
  INITIAL_BUDGET,
} from '../types/index';

export class AuthService {
  private saltRounds = 12;
  private emailService: EmailService;
  private teamGenerationJob: TeamGenerationJob;

  constructor() {
    this.emailService = new EmailService();
    this.teamGenerationJob = new TeamGenerationJob();
  }

  async authenticate(data: LoginRequest): Promise<UnifiedAuthResponse> {
    const { email, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const isValidPassword = await bcrypt.compare(password, existingUser.password);

      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      const token = generateToken({
        userId: existingUser.id,
        email: existingUser.email,
      });

      return {
        token,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          budget: existingUser.budget,
          teamGenerationStatus: existingUser.teamGenerationStatus,
        },
        isNewUser: false,
      };
    } else {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          budget: INITIAL_BUDGET,
          teamGenerationStatus: TeamGenerationStatus.PROCESSING,
        },
      });

      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
      });

      try {
        await this.emailService.sendWelcomeEmail(newUser.email, newUser.email);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }

      setImmediate(async () => {
        try {
          await this.teamGenerationJob.execute(newUser.id);
          console.log(`Team generation completed for new user: ${newUser.email}`);
        } catch (error) {
          console.error(`Team generation failed for new user ${newUser.email}:`, error);
        }
      });

      return {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          budget: newUser.budget,
          teamGenerationStatus: newUser.teamGenerationStatus,
        },
        isNewUser: true,
      };
    }
  }

  async getProfile(userId: string): Promise<{
    id: string;
    email: string;
    budget: number;
    teamGenerationStatus: TeamGenerationStatus;
    teamGeneratedAt: Date | null;
    createdAt: Date;
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        budget: true,
        teamGenerationStatus: true,
        teamGeneratedAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async refreshToken(userId: string): Promise<{ token: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return { token };
  }

  async updateUserBudget(userId: string, newBudget: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { budget: newBudget },
    });
  }

  async updateTeamGenerationStatus(
    userId: string,
    status: TeamGenerationStatus,
    teamGeneratedAt?: Date | null
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        teamGenerationStatus: status,
        ...(teamGeneratedAt !== undefined && { teamGeneratedAt }),
      },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security, don't reveal if email exists or not
      return;
    }

    const resetToken = generateToken({ userId: user.id, email: user.email }, '1h');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send password reset email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, user.email, resetToken);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }
}
