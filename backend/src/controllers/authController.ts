import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { LoginRequest, AuthenticatedRequest } from '../types/index';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  authenticate = async (req: Request, res: Response): Promise<void> => {
    try {
      const authData: LoginRequest = req.body;
      const result = await this.authService.authenticate(authData);

      res.status(200).json({
        success: true,
        data: result,
        message: result.isNewUser ? 'User registered successfully' : 'Login successful',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  };

  profile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthenticatedRequest).user.userId;
      const profile = await this.authService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Profile retrieved successfully',
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Profile not found',
      });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthenticatedRequest).user.userId;
      const result = await this.authService.refreshToken(userId);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed',
      });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send reset email',
      });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body;
      await this.authService.resetPassword(token, password);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      });
    }
  };
}
