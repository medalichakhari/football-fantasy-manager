import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTeam } from "../../hooks/useTeam";
import { useTransfer } from "../../hooks/useTransfer";
import { Position } from "../../types/team";

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
    }
  };

  const getPositionColor = (position: Position) => {
    const colors: Record<Position, string> = {
      GK: "bg-yellow-100 text-yellow-800",
      DEF: "bg-blue-100 text-blue-800",
      MID: "bg-green-100 text-green-800",
      ATT: "bg-red-100 text-red-800",
    };
    return colors[position] || "bg-gray-100 text-gray-800";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoadingTeam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!teamData || !teamData.players || teamData.players.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-8">
            <Link
              to="/transfers"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Transfer Market
            </Link>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Players to Sell
            </h2>
            <p className="text-gray-600">
              You don't have any players in your team to list for sale.
            </p>
            <Link
              to="/transfers"
              className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Transfer Market
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/transfers"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Transfer Market
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sell a Player</h1>
          <p className="text-gray-600 mt-2">
            Choose a player from your team to list on the transfer market
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player Selection */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Select Player
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {teamData.players.map((userPlayer) => {
                  const player = userPlayer.player;
                  return (
                    <div
                      key={userPlayer.id}
                      onClick={() => setSelectedPlayer(userPlayer)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPlayer?.id === userPlayer.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {player.name.charAt(0)}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {player.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPositionColor(
                                player.position as Position
                              )}`}
                            >
                              {player.position}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Team: {player.team}</span>
                            <span>•</span>
                            <span>Value: {formatPrice(player.price)}</span>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {selectedPlayer?.id === userPlayer.id && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Listing Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Set Price</h2>
            </div>

            <div className="p-6">
              {selectedPlayer ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Selected Player
                    </h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {selectedPlayer.player.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {selectedPlayer.player.name}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPositionColor(
                              selectedPlayer.player.position as Position
                            )}`}
                          >
                            {selectedPlayer.player.position}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Market Value:{" "}
                          {formatPrice(selectedPlayer.player.price)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Listing Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        value={listingPrice}
                        onChange={(e) => setListingPrice(e.target.value)}
                        placeholder="Enter price"
                        className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Suggested range:{" "}
                      {formatPrice(
                        Math.max(1, selectedPlayer.player.price * 0.8)
                      )}{" "}
                      - {formatPrice(selectedPlayer.player.price * 1.2)}
                    </p>
                  </div>

                  {(error || createListingError) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600">
                        {error || createListingError}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isCreatingListing}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isCreatingListing
                      ? "Creating Listing..."
                      : "List Player for Sale"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Select a player from your team to set a price
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPlayerPage;
