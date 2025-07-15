import { Shield, Target, Zap, Users } from "lucide-react";
import { Player, Position } from "../../types/team";
import { PlayerGrid } from "./PlayerCard";
import { cn } from "../../utils";

interface PositionSectionProps {
  position: Position;
  players: Player[];
  title: string;
  className?: string;
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

export const PositionSection = ({
  position,
  players,
  title,
  className,
}: PositionSectionProps) => {
  const Icon = positionIcons[position] || Users;
  const colorClass = positionColors[position] || positionColors.GK;

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 p-6",
        className
      )}
    >
      <div className="flex items-center mb-6">
        <div className={cn("p-2 rounded-lg", colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 ml-3">
          {title} ({players.length})
        </h3>
      </div>

      <PlayerGrid
        players={players}
        emptyMessage={`No ${title.toLowerCase()} in your team`}
      />
    </div>
  );
};
