import React from "react";
import { Card, CardContent } from "../ui/card";
import { PlayerAvatar } from "../ui/player-avatar";
import { PositionBadge } from "../ui/position-badge";
import { cn } from "../../utils";
import { formatCurrency } from "../../utils";

interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    position: string;
    team?: string;
    price: number;
    skill?: number;
    age?: number;
    nationality?: string;
  };
  listing?: {
    id: string;
    price: number;
    createdAt: string;
    seller?: {
      email: string;
    };
  };
  actionButton?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  showSellerView?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  listing,
  actionButton,
  onClick,
  selected,
  className,
  showSellerView = false,
}) => {
  const displayPrice = listing?.price || player.price;

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        onClick && "cursor-pointer hover:bg-gray-50",
        selected &&
          "border-2 border-blue-500 bg-blue-50 ring-1 ring-blue-200 shadow-lg",
        !selected && "border border-gray-200",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <PlayerAvatar name={player.name} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {player.name}
                </h3>
                <PositionBadge position={player.position} />
                {selected && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ml-auto sm:ml-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                {player.team && (
                  <>
                    <span className="truncate max-w-24 sm:max-w-none">
                      Team: {player.team}
                    </span>
                    <span className="hidden sm:inline">•</span>
                  </>
                )}
                {player.skill && (
                  <>
                    <span>Skill: {player.skill}</span>
                    <span className="hidden sm:inline">•</span>
                  </>
                )}
                {listing?.seller && (
                  <>
                    <span className="truncate max-w-32 sm:max-w-none">
                      Listed by: {listing.seller.email}
                    </span>
                    <span className="hidden sm:inline">•</span>
                  </>
                )}
                {listing?.createdAt && (
                  <span className="whitespace-nowrap">
                    Listed: {new Date(listing.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end sm:space-x-4 sm:flex-shrink-0">
            <div className="text-left sm:text-right">
              <div className="text-lg sm:text-xl font-bold text-gray-900">
                {formatCurrency(displayPrice)}
              </div>
              {listing && !showSellerView && (
                <div className="space-y-1">
                  <div className="text-sm text-green-600 font-medium">
                    You pay: {formatCurrency(Math.floor(displayPrice * 0.95))}
                  </div>
                  <div className="text-xs text-gray-500">
                    (5% transfer discount applied)
                  </div>
                </div>
              )}
              {listing && showSellerView && (
                <div className="space-y-1">
                  <div className="text-sm text-blue-600 font-medium">
                    You'll receive:{" "}
                    {formatCurrency(Math.floor(displayPrice * 0.95))}
                  </div>
                  <div className="text-xs text-gray-500">
                    (5% transfer fee deducted)
                  </div>
                </div>
              )}
              {listing && listing.price !== player.price && (
                <div className="text-xs sm:text-sm text-gray-500">
                  Market value: {formatCurrency(player.price)}
                </div>
              )}
            </div>

            {actionButton && (
              <div className="flex-shrink-0">{actionButton}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
