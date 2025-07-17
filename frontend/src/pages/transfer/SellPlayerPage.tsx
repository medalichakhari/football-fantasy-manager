import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTeam } from "../../hooks/useTeam";
import { useTransfer } from "../../hooks/useTransfer";
import { LoadingState } from "../../components/ui/states";
import { PageHeader } from "../../components/ui/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { PlayerCard } from "../../components/player/PlayerCard";
import { PlayerAvatar } from "../../components/ui/player-avatar";
import { PositionBadge } from "../../components/ui/position-badge";
import { formatCurrency } from "../../utils";

const SellPlayerPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamData, isLoadingTeam } = useTeam();
  const { createListing, isCreatingListing, createListingError } =
    useTransfer();

  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [listingPrice, setListingPrice] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedPlayer) {
      setError("Please select a player to sell");
      return;
    }

    const price = parseFloat(listingPrice);
    if (!price || price <= 0) {
      setError("Please enter a valid price");
      return;
    }

    try {
      await createListing({
        playerId: selectedPlayer.player.id,
        price,
      });

      navigate("/transfers");
    } catch (err) {
      // Error is handled by the hook
    }
  };

  if (isLoadingTeam) {
    return (
      <LoadingState
        title="Loading your team..."
        description="Please wait while we fetch your players."
      />
    );
  }

  if (!teamData || !teamData.players || teamData.players.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-8">
            <Link
              to="/transfers"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Transfer Market
            </Link>
          </div>

          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Players to Sell
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have any players in your team to list for sale.
              </p>
              <Link
                to="/transfers"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Transfer Market
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link
            to="/transfers"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transfer Market
          </Link>
        </div>

        <PageHeader
          title="Sell a Player"
          description="Choose a player from your team to list on the transfer market"
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Player Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Player</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {teamData.players.map((userPlayer) => (
                  <PlayerCard
                    key={userPlayer.id}
                    player={userPlayer.player}
                    onClick={() => setSelectedPlayer(userPlayer)}
                    selected={selectedPlayer?.id === userPlayer.id}
                    className="cursor-pointer"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Listing Form */}
          <Card>
            <CardHeader>
              <CardTitle>Set Price</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPlayer ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-3">
                        Selected Player
                      </h3>
                      <div className="flex items-center space-x-3">
                        <PlayerAvatar name={selectedPlayer.player.name} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {selectedPlayer.player.name}
                            </span>
                            <PositionBadge
                              position={selectedPlayer.player.position}
                            />
                          </div>
                          <div className="text-sm text-gray-500">
                            Market Value:{" "}
                            {formatCurrency(selectedPlayer.player.price)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Listing Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <Input
                        type="number"
                        id="price"
                        value={listingPrice}
                        onChange={(e) => setListingPrice(e.target.value)}
                        placeholder="Enter price"
                        className="pl-7"
                        required
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Suggested range:{" "}
                      {formatCurrency(
                        Math.max(1, selectedPlayer.player.price * 0.8)
                      )}{" "}
                      - {formatCurrency(selectedPlayer.player.price * 1.2)}
                    </p>
                    {listingPrice && parseFloat(listingPrice) > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Listing Price:</span>
                          <span className="font-medium">
                            {formatCurrency(parseFloat(listingPrice))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-gray-600">You'll receive:</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(
                              Math.floor(parseFloat(listingPrice) * 0.95)
                            )}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          * 5% transfer fee applies to all sales
                        </div>
                      </div>
                    )}
                  </div>

                  {(error || createListingError) && (
                    <Card className="border-red-200 bg-red-50">
                      <CardContent className="p-4">
                        <p className="text-red-600">
                          {error || createListingError}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    type="submit"
                    loading={isCreatingListing}
                    disabled={isCreatingListing}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {isCreatingListing
                      ? "Creating Listing..."
                      : "List Player for Sale"}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    Select a player from your team to set a price
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellPlayerPage;
