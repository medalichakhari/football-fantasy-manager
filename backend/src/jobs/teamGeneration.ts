import { prisma } from '../models/index';
import { generateRandomPlayer } from '../utils/playerGenerator';
import { Position, TEAM_REQUIREMENTS, INITIAL_BUDGET, TeamGenerationStatus } from '../types/index';
import { EmailService } from '../services/emailService';

export class TeamGenerationJob {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async execute(userId: string): Promise<void> {
    try {
      await this.generateTeamForUser(userId);

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          teamGenerationStatus: TeamGenerationStatus.COMPLETED,
          teamGeneratedAt: new Date(),
        },
        select: {
          email: true,
        },
      });

      try {
        await this.emailService.sendTeamGenerationCompleteEmail(user.email, user.email);
        console.log(`Team generation completion email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send team generation completion email:', emailError);
      }
    } catch (error) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          teamGenerationStatus: TeamGenerationStatus.FAILED,
        },
      });
      throw error;
    }
  }

  private async generateTeamForUser(userId: string): Promise<void> {
    return await prisma.$transaction(async tx => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const existingPlayersCount = await tx.userPlayer.count({
        where: { userId },
      });

      if (existingPlayersCount > 0) {
        throw new Error('User already has players');
      }

      const playersToGenerate = this.createPlayerComposition();
      const generatedPlayers = [];

      for (const { position, price } of playersToGenerate) {
        const playerData = generateRandomPlayer(position, price);
        const player = await tx.player.create({
          data: playerData,
        });

        generatedPlayers.push({
          userId,
          playerId: player.id,
          price,
        });
      }

      await Promise.all([
        tx.userPlayer.createMany({
          data: generatedPlayers,
        }),
        tx.user.update({
          where: { id: userId },
          data: { budget: INITIAL_BUDGET },
        }),
      ]);
    });
  }

  private createPlayerComposition(): Array<{ position: Position; price: number }> {
    const averagePlayerPrice = 2000000;
    const priceVariance = averagePlayerPrice * 0.5;
    const minPrice = 500000;
    const maxPrice = averagePlayerPrice + priceVariance;

    const composition = [];

    for (let i = 0; i < TEAM_REQUIREMENTS.GOALKEEPERS; i++) {
      composition.push({
        position: Position.GK,
        price: Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice,
      });
    }

    for (let i = 0; i < TEAM_REQUIREMENTS.DEFENDERS; i++) {
      composition.push({
        position: Position.DEF,
        price: Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice,
      });
    }

    for (let i = 0; i < TEAM_REQUIREMENTS.MIDFIELDERS; i++) {
      composition.push({
        position: Position.MID,
        price: Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice,
      });
    }

    for (let i = 0; i < TEAM_REQUIREMENTS.ATTACKERS; i++) {
      composition.push({
        position: Position.ATT,
        price: Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice,
      });
    }

    return composition;
  }
}
