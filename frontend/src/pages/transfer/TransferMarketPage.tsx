import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { useTransfer } from "../../hooks/useTransfer";
import { TransferMarketFilters } from "../../types/transfer";
import { PageHeader } from "../../components/ui/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { LoadingState, ErrorState } from "../../components/ui/states";
import { PlayerCard } from "../../components/player/PlayerCard";
import { FilterPanel } from "../../components/transfer/FilterPanel";
import { BuyPlayerDialog } from "../../components/transfer/BuyPlayerDialog";
import { Pagination } from "../../components/ui/pagination";

const TransferMarketPage: React.FC = () => {
  const [filters, setFilters] = useState<TransferMarketFilters>({
    position: "",
    minPrice: undefined,
    maxPrice: undefined,
    search: "",
    page: 1,
    limit: 6,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [buyDialog, setBuyDialog] = useState<{
    isOpen: boolean;
    listing: any | null;
  }>({
    isOpen: false,
    listing: null,
  });

  const { useMarketListings, buyPlayer, isBuyingPlayer } = useTransfer();
  const {
    data: marketData,
    isLoading,
    error,
    isFetching,
  } = useMarketListings(filters);

  const handleFilterChange = useCallback(
    (key: keyof TransferMarketFilters, value: string) => {
      setFilters((prev: TransferMarketFilters) => ({
        ...prev,
        [key]:
          key === "minPrice" || key === "maxPrice"
            ? value === ""
              ? undefined
              : Number(value)
            : value,
        ...(key !== "page" && { page: 1 }),
      }));
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev: TransferMarketFilters) => ({
      ...prev,
      page,
    }));
  }, []);

  const handleBuyPlayer = (_listingId: string, listing: any) => {
    setBuyDialog({
      isOpen: true,
      listing: listing,
    });
  };

  const handleConfirmBuy = () => {
    if (buyDialog.listing) {
      buyPlayer({ transferListingId: buyDialog.listing.id });
      setBuyDialog({ isOpen: false, listing: null });
    }
  };

  const handleCloseBuyDialog = () => {
    setBuyDialog({ isOpen: false, listing: null });
  };

  if (isLoading) {
    return (
      <LoadingState
        title="Loading transfer market..."
        description="Please wait while we fetch the latest player listings."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Error Loading Transfer Market"
        description={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Transfer Market"
          description="Buy and sell players to strengthen your team"
        >
          <Link
            to="/transfer/my-listings"
            className="inline-flex items-center border border-gray-300 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            My Listings
          </Link>
          <Link
            to="/transfer/sell"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            List Player
          </Link>
        </PageHeader>

        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          showAdvanced={showFilters}
          onToggleAdvanced={() => setShowFilters(!showFilters)}
        />

        {/* {buyPlayerError && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{buyPlayerError}</p>
            </CardContent>
          </Card>
        )} */}

        <Card>
          <CardHeader>
            <CardTitle>
              Available Players ({marketData?.listings?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {marketData?.listings?.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="text-gray-400 mb-4">
                  <Users className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No players available
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search filters or check back later
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {marketData?.listings?.map((listing: any) => (
                  <div key={listing.id} className="p-6">
                    <PlayerCard
                      player={listing.player}
                      listing={listing}
                      actionButton={
                        <Button
                          onClick={() => handleBuyPlayer(listing.id, listing)}
                          loading={isBuyingPlayer}
                          disabled={isBuyingPlayer}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isBuyingPlayer ? "Buying..." : "Buy Now"}
                        </Button>
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {marketData && marketData.totalCount > 0 && (
            <div
              className={`${
                isFetching ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Pagination
                currentPage={filters.page || 1}
                totalCount={marketData.totalCount}
                pageSize={filters.limit || 6}
                onPageChange={handlePageChange}
                showInfo={true}
              />
            </div>
          )}
        </Card>

        <BuyPlayerDialog
          isOpen={buyDialog.isOpen}
          onClose={handleCloseBuyDialog}
          onConfirm={handleConfirmBuy}
          player={buyDialog.listing?.player || null}
          isLoading={isBuyingPlayer}
        />
      </div>
    </div>
  );
};

export default TransferMarketPage;
