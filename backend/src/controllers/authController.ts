import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { LoginRequest, AuthenticatedRequest } from '../types/index';
import { handleError } from '../utils/errorHandler';

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
      handleError(res, error, 'Authentication failed', 400);
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
      handleError(res, error, 'Profile not found', 404);
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
      handleError(res, error, 'Token refresh failed', 401);
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
      handleError(res, error, 'Failed to send reset email', 400);
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
      handleError(res, error, 'Password reset failed', 400);
    }
  };
}
