import React from "react";
import { cn } from "../../utils";

interface PositionBadgeProps {
  position: string;
  className?: string;
}

export const PositionBadge: React.FC<PositionBadgeProps> = ({
  position,
  className,
}) => {
  const getPositionColor = (pos: string) => {
    const colors: Record<string, string> = {
      GK: "bg-yellow-100 text-yellow-800 border-yellow-200",
      DEF: "bg-blue-100 text-blue-800 border-blue-200",
      MID: "bg-green-100 text-green-800 border-green-200",
      ATT: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[pos] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getPositionColor(position),
        className
      )}
    >
      {position}
    </span>
  );
};
