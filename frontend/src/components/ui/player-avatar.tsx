import React from "react";
import { cn } from "../../utils";

interface PlayerAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  name,
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl",
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0",
        sizeClasses[size],
        className
      )}
    >
      <span className="text-white font-bold">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};
