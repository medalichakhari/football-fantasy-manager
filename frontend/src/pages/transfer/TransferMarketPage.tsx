import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Filter, Search } from "lucide-react";
import { useTransfer } from "../../hooks/useTransfer";
import { TransferMarketFilters } from "../../types/transfer";

const TransferMarketPage: React.FC = () => {
  const [filters, setFilters] = useState<TransferMarketFilters>({
    position: "",
    minPrice: undefined,
    maxPrice: undefined,
    search: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const { useMarketListings, buyPlayer, isBuyingPlayer, buyPlayerError } =
    useTransfer();
  const { data: marketData, isLoading, error } = useMarketListings(filters);

  const handleFilterChange = (
    key: keyof TransferMarketFilters,
    value: string
  ) => {
    setFilters((prev: TransferMarketFilters) => ({
      ...prev,
      [key]:
        key === "minPrice" || key === "maxPrice"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleBuyPlayer = (listingId: string) => {
    buyPlayer({ transferListingId: listingId });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      GK: "bg-yellow-100 text-yellow-800",
      DEF: "bg-blue-100 text-blue-800",
      MID: "bg-green-100 text-green-800",
      ATT: "bg-red-100 text-red-800",
    };
    return colors[position] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Transfer Market
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Transfer Market
            </h1>
            <p className="text-gray-600 mt-2">
              Buy and sell players to strengthen your team
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/transfer/my-listings"
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              My Listings
            </Link>
            <Link
              to="/transfer/sell"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              List Player
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <select
                  value={filters.position}
                  onChange={(e) =>
                    handleFilterChange("position", e.target.value)
                  }
                  title="Select position"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Positions</option>
                  <option value="GK">Goalkeeper</option>
                  <option value="DEF">Defender</option>
                  <option value="MID">Midfielder</option>
                  <option value="ATT">Attacker</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {buyPlayerError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{buyPlayerError}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Available Players ({marketData?.listings?.length || 0})
            </h2>
          </div>

          {marketData?.listings?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No players available</p>
              <p className="text-gray-400 mt-2">
                Try adjusting your search filters
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {marketData?.listings?.map((listing: any) => (
                <div
                  key={listing.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {listing.player.name.charAt(0)}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {listing.player.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPositionColor(
                              listing.player.position
                            )}`}
                          >
                            {listing.player.position}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Skill: {listing.player.skill}</span>
                          <span>•</span>
                          <span>Listed by: {listing.seller.email}</span>
                          <span>•</span>
                          <span>
                            Listed:{" "}
                            {new Date(listing.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatPrice(listing.price)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyPlayer(listing.id)}
                        disabled={isBuyingPlayer}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isBuyingPlayer ? "Buying..." : "Buy Now"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferMarketPage;
