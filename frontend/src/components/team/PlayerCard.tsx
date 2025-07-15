import { Shield, Target, Zap } from "lucide-react";
import { Player } from "../../types/team";
import { formatCurrency, cn } from "../../utils";

interface PlayerCardProps {
  player: Player;
  className?: string;
  showTeam?: boolean;
  showPrice?: boolean;
}

const positionIcons = {
  GK: Shield,
  DEF: Shield,
  MID: Zap,
  ATT: Target,
} as const;

const positionColors = {
  GK: "bg-yellow-100 text-yellow-800 border-yellow-200",
  DEF: "bg-blue-100 text-blue-800 border-blue-200",
  MID: "bg-green-100 text-green-800 border-green-200",
  ATT: "bg-red-100 text-red-800 border-red-200",
} as const;

export const PlayerCard = ({
  player,
  className,
  showTeam = true,
  showPrice = true,
}: PlayerCardProps) => {
  const Icon = positionIcons[player.position] || Shield;
  const colorClass = positionColors[player.position] || positionColors.GK;

  return (
    <div
      className={cn(
        "border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white",
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 truncate pr-2">
          {player.name}
        </h4>
        <span
          className={cn(
            "px-2 py-1 text-xs rounded-full border flex-shrink-0",
            colorClass
          )}
        >
          <Icon className="h-3 w-3 inline mr-1" />
          {player.position}
        </span>
      </div>

      {showTeam && <p className="text-sm text-gray-600 mb-2">{player.team}</p>}

      {showPrice && (
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(player.price)}
          </span>
        </div>
      )}
    </div>
  );
};

interface PlayerGridProps {
  players: Player[];
  className?: string;
  emptyMessage?: string;
}

export const PlayerGrid = ({
  players,
  className,
  emptyMessage = "No players found",
}: PlayerGridProps) => {
  if (players.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
        className
      )}
    >
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
};
