import { Request, Response } from 'express';
import { TeamService } from '../services/teamService';
import { AuthenticatedRequest } from '../types/index';
import { handleError } from '../utils/errorHandler';

export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  getTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthenticatedRequest).user.userId;
      const team = await this.teamService.getUserTeam(userId);

      res.status(200).json({
        success: true,
        data: team,
        message: 'Team retrieved successfully',
      });
    } catch (error) {
      handleError(res, error, 'Team not found', 404);
    }
  };

  generateTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthenticatedRequest).user.userId;
      const result = await this.teamService.initiateTeamGeneration(userId);

      res.status(202).json({
        success: true,
        data: result,
        message: 'Team generation initiated',
      });
    } catch (error) {
      handleError(res, error, 'Team generation failed', 400);
    }
  };

  getTeamStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthenticatedRequest).user.userId;
      const stats = await this.teamService.getTeamStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Team stats retrieved successfully',
      });
    } catch (error) {
      handleError(res, error, 'Team stats not found', 404);
    }
  };
}
