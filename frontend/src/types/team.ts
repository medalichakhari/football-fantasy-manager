export interface User {
  id: string;
  email: string;
  budget: number;
  teamGenerationStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  teamGeneratedAt?: Date;
}

export interface Player {
  id: string;
  name: string;
  position: "GK" | "DEF" | "MID" | "ATT";
  team: string;
  price: number;
}

export interface UserPlayer {
  id: string;
  userId: string;
  playerId: string;
  acquiredAt: Date;
  price: number;
  player: Player;
}

export interface TeamStats {
  goalkeepers: number;
  defenders: number;
  midfielders: number;
  attackers: number;
  totalPlayers: number;
}

export interface TeamResponse {
  players: UserPlayer[];
  budget: number;
  teamStats: TeamStats;
}

export interface TeamStatsResponse extends TeamStats {
  totalValue: number;
  averageValue: number;
}

export interface TeamGenerationResponse {
  message: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
}

export type Position = "GK" | "DEF" | "MID" | "ATT";

export interface PlayersByPosition {
  GK: Player[];
  DEF: Player[];
  MID: Player[];
  ATT: Player[];
}
