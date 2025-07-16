import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useTransfer } from "../../hooks/useTransfer";

const MyListingsPage: React.FC = () => {
  const {
    useUserListings,
    removeListing,
    isRemovingListing,
    removeListingError,
  } = useTransfer();
  const { data: listings, isLoading, error } = useUserListings();

  const handleRemoveListing = (listingId: string) => {
    if (window.confirm("Are you sure you want to remove this listing?")) {
      removeListing(listingId);
    }
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
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
            Error Loading Listings
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-2">
            Manage your players currently listed on the transfer market
          </p>
        </div>

        {removeListingError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{removeListingError}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Active Listings ({listings?.length || 0})
            </h2>
          </div>

          {!listings || listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No active listings</p>
              <p className="text-gray-400 mt-2">
                You don't have any players listed for sale
              </p>
              <Link
                to="/transfer/sell"
                className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                List a Player
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {listings?.map((listing) => (
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
                          <span>Team: {listing.player.team}</span>
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
                        <div className="text-sm text-gray-500">
                          Original value: {formatPrice(listing.player.price)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveListing(listing.id)}
                        disabled={isRemovingListing}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2"
                        title="Remove listing"
                      >
                        <Trash2 className="h-5 w-5" />
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

export default MyListingsPage;
