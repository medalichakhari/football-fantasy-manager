import { prisma } from '../models/index';
import { TeamGenerationJob } from '../jobs/teamGeneration';
import {
  TeamResponse,
  TeamGenerationStatus,
  Position,
  TeamStatsResponse,
  TeamGenerationResponse,
  Player,
} from '../types/index';

export class TeamService {
  private teamGenerationJob: TeamGenerationJob;

  constructor() {
    this.teamGenerationJob = new TeamGenerationJob();
  }

  async getUserTeam(userId: string): Promise<TeamResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { budget: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const userPlayers = await prisma.userPlayer.findMany({
      where: { userId },
      include: {
        player: true,
      },
      orderBy: [{ player: { position: 'asc' } }, { player: { name: 'asc' } }],
    });

    const teamStats = this.calculateTeamStats(userPlayers.map(up => up.player));

    return {
      players: userPlayers,
      budget: user.budget,
      teamStats,
    };
  }

  async getTeamStats(userId: string): Promise<TeamStatsResponse> {
    const userPlayers = await prisma.userPlayer.findMany({
      where: { userId },
      include: {
        player: true,
      },
    });

    const players = userPlayers.map(up => up.player);
    const teamStats = this.calculateTeamStats(players);
    const totalValue = userPlayers.reduce((sum, up) => sum + up.price, 0);
    const averageValue = players.length > 0 ? totalValue / players.length : 0;

    return {
      ...teamStats,
      totalValue,
      averageValue: Math.round(averageValue),
    };
  }

  async initiateTeamGeneration(userId: string): Promise<TeamGenerationResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        teamGenerationStatus: true,
        email: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.teamGenerationStatus === TeamGenerationStatus.PROCESSING) {
      throw new Error('Team generation is already in progress');
    }

    if (user.teamGenerationStatus === TeamGenerationStatus.COMPLETED) {
      throw new Error('Team has already been generated');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        teamGenerationStatus: TeamGenerationStatus.PROCESSING,
      },
    });

    try {
      await this.teamGenerationJob.execute(userId);
    } catch (error) {
      throw new Error(
        `Team generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    return {
      message: 'Team generation completed successfully',
      status: TeamGenerationStatus.COMPLETED,
    };
  }

  private calculateTeamStats(players: Player[]): {
    goalkeepers: number;
    defenders: number;
    midfielders: number;
    attackers: number;
    totalPlayers: number;
  } {
    const stats = {
      goalkeepers: 0,
      defenders: 0,
      midfielders: 0,
      attackers: 0,
      totalPlayers: players.length,
    };

    return players.reduce((acc, player) => {
      switch (player.position) {
        case Position.GK:
          acc.goalkeepers++;
          break;
        case Position.DEF:
          acc.defenders++;
          break;
        case Position.MID:
          acc.midfielders++;
          break;
        case Position.ATT:
          acc.attackers++;
          break;
        default:
          break;
      }
      return acc;
    }, stats);
  }
}
