import { prisma } from '../models/index';
import { generateRandomPlayer } from '../utils/playerGenerator';
import { Position, TEAM_REQUIREMENTS, INITIAL_BUDGET, TeamGenerationStatus } from '../types/index';

export class TeamGenerationJob {
  async execute(userId: string): Promise<void> {
    try {
      await this.generateTeamForUser(userId);

      await prisma.user.update({
        where: { id: userId },
        data: {
          teamGenerationStatus: TeamGenerationStatus.COMPLETED,
          teamGeneratedAt: new Date(),
        },
      });
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const existingPlayers = await prisma.userPlayer.findMany({
      where: { userId },
    });

    if (existingPlayers.length > 0) {
      throw new Error('User already has players');
    }

    const targetBudget = INITIAL_BUDGET;
    const totalPlayers = TEAM_REQUIREMENTS.TOTAL;

    const averagePlayerPrice = Math.floor(targetBudget / totalPlayers);
    const priceVariance = averagePlayerPrice * 0.3;

    const playersToGenerate = [
      ...Array(TEAM_REQUIREMENTS.GOALKEEPERS).fill(Position.GK),
      ...Array(TEAM_REQUIREMENTS.DEFENDERS).fill(Position.DEF),
      ...Array(TEAM_REQUIREMENTS.MIDFIELDERS).fill(Position.MID),
      ...Array(TEAM_REQUIREMENTS.ATTACKERS).fill(Position.ATT),
    ];

    let remainingBudget = targetBudget;
    const generatedPlayers = [];

    for (let i = 0; i < playersToGenerate.length; i++) {
      const position = playersToGenerate[i];
      const isLastPlayer = i === playersToGenerate.length - 1;

      let price: number;
      if (isLastPlayer) {
        price = remainingBudget;
      } else {
        const minPrice = Math.max(
          averagePlayerPrice - priceVariance,
          Math.floor(remainingBudget * 0.1)
        );
        const maxPrice = Math.min(
          averagePlayerPrice + priceVariance,
          Math.floor(remainingBudget * 0.3)
        );
        price = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
      }

      const player = await this.createPlayer(position, price);
      generatedPlayers.push({
        userId,
        playerId: player.id,
        price,
      });

      remainingBudget -= price;
    }

    await prisma.userPlayer.createMany({
      data: generatedPlayers,
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        budget: remainingBudget,
      },
    });
  }

  private async createPlayer(position: Position, price: number): Promise<{ id: string }> {
    const playerData = generateRandomPlayer(position, price);

    const player = await prisma.player.create({
      data: playerData,
    });

    return player;
  }
}
