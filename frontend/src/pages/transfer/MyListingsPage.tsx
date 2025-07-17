import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { useTransfer } from "../../hooks/useTransfer";
import { LoadingState, ErrorState } from "../../components/ui/states";
import { PageHeader } from "../../components/ui/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { PlayerCard } from "../../components/player/PlayerCard";
import { RemoveListingDialog } from "../../components/transfer/RemoveListingDialog";

const MyListingsPage: React.FC = () => {
  const [removeDialog, setRemoveDialog] = useState<{
    isOpen: boolean;
    listing: any | null;
  }>({
    isOpen: false,
    listing: null,
  });

  const {
    useUserListings,
    removeListing,
    isRemovingListing,
    removeListingError,
  } = useTransfer();
  const { data: listings, isLoading, error } = useUserListings();

  const handleRemoveListing = (_listingId: string, listing: any) => {
    setRemoveDialog({
      isOpen: true,
      listing: listing,
    });
  };

  const handleConfirmRemove = () => {
    if (removeDialog.listing) {
      removeListing(removeDialog.listing.id);
      setRemoveDialog({ isOpen: false, listing: null });
    }
  };

  const handleCloseRemoveDialog = () => {
    setRemoveDialog({ isOpen: false, listing: null });
  };

  if (isLoading) {
    return (
      <LoadingState
        title="Loading your listings..."
        description="Please wait while we fetch your active listings."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Error Loading Listings"
        description={error.message}
        onRetry={() => window.location.reload()}
      />
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
          title="My Listings"
          description="Manage your players currently listed on the transfer market"
        >
          <Link
            to="/transfer/sell"
            className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            List Another Player
          </Link>
        </PageHeader>

        {removeListingError && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{removeListingError}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Active Listings ({listings?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!listings || listings.length === 0 ? (
              <div className="text-center py-12 px-6">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No active listings
                </h3>
                <p className="text-gray-500 mb-6">
                  You don't have any players listed for sale
                </p>
                <Link
                  to="/transfer/sell"
                  className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  List a Player
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {listings?.map((listing) => (
                  <div key={listing.id} className="p-6">
                    <PlayerCard
                      player={listing.player}
                      listing={listing}
                      showSellerView={true}
                      actionButton={
                        <Button
                          variant="ghost"
                          onClick={() =>
                            handleRemoveListing(listing.id, listing)
                          }
                          disabled={isRemovingListing}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <RemoveListingDialog
          isOpen={removeDialog.isOpen}
          onClose={handleCloseRemoveDialog}
          onConfirm={handleConfirmRemove}
          player={removeDialog.listing?.player || null}
          isLoading={isRemovingListing}
        />
      </div>
    </div>
  );
};

export default MyListingsPage;
