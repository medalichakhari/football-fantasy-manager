import { Request, Response } from 'express';
import { TeamService } from '../services/teamService';
import { AuthenticatedRequest } from '../types/index';

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
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Team not found',
      });
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
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Team generation failed',
      });
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
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Team stats not found',
      });
    }
  };
}
