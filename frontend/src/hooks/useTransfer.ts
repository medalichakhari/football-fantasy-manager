import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, handleApiResponse } from "../lib/api-client";
import { ApiResponse } from "../types/auth";
import {
  TransferMarketResponse,
  TransferMarketFilters,
  TransferListing,
  CreateTransferListingRequest,
  BuyPlayerRequest,
  BuyPlayerResponse,
} from "../types/transfer";
import { showToast } from "../utils/toast";

const transferApi = {
  getMarketListings: async (
    filters: TransferMarketFilters
  ): Promise<TransferMarketResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        const stringValue =
          typeof value === "number" ? value.toString() : value;
        params.append(key, stringValue);
      }
    });

    const response = await apiClient.get<ApiResponse<TransferMarketResponse>>(
      `/transfer/market?${params}`
    );
    return handleApiResponse(response).data!;
  },

  getUserListings: async (): Promise<TransferListing[]> => {
    const response = await apiClient.get<ApiResponse<TransferListing[]>>(
      "/transfer/my-listings"
    );
    return handleApiResponse(response).data!;
  },

  createListing: async (
    data: CreateTransferListingRequest
  ): Promise<TransferListing> => {
    const response = await apiClient.post<ApiResponse<TransferListing>>(
      "/transfer/market",
      data
    );
    return handleApiResponse(response).data!;
  },

  buyPlayer: async (data: BuyPlayerRequest): Promise<BuyPlayerResponse> => {
    const response = await apiClient.post<ApiResponse<BuyPlayerResponse>>(
      "/transfer/buy",
      data
    );
    return handleApiResponse(response).data!;
  },

  removeListing: async (listingId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/transfer/listings/${listingId}`
    );
    return handleApiResponse(response).data;
  },
};

export const useTransfer = () => {
  const queryClient = useQueryClient();

  const useMarketListings = (filters: TransferMarketFilters) => {
    return useQuery({
      queryKey: ["transferMarket", filters],
      queryFn: () => transferApi.getMarketListings(filters),
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      enabled:
        Object.values(filters).some(
          (value) => value !== undefined && value !== "" && value !== null
        ) || Object.keys(filters).length === 0,
    });
  };

  const useUserListings = () => {
    return useQuery({
      queryKey: ["userTransferListings"],
      queryFn: transferApi.getUserListings,
      staleTime: 1 * 60 * 1000,
    });
  };

  const createListingMutation = useMutation({
    mutationFn: transferApi.createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTransferListings"] });
      queryClient.invalidateQueries({ queryKey: ["transferMarket"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      showToast.success("Player listed for transfer successfully!");
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Failed to list player for transfer";
      showToast.error(errorMessage);
    },
  });

  const buyPlayerMutation = useMutation({
    mutationFn: transferApi.buyPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transferMarket"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["userTransferListings"] });
      showToast.success("Player purchased successfully! Welcome to your team!");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to purchase player";
      showToast.error(errorMessage);
    },
  });

  const removeListingMutation = useMutation({
    mutationFn: transferApi.removeListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTransferListings"] });
      queryClient.invalidateQueries({ queryKey: ["transferMarket"] });
      showToast.success("Transfer listing removed successfully!");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to remove transfer listing";
      showToast.error(errorMessage);
    },
  });

  return {
    useMarketListings,
    useUserListings,

    createListing: createListingMutation.mutate,
    buyPlayer: buyPlayerMutation.mutate,
    removeListing: removeListingMutation.mutate,

    isCreatingListing: createListingMutation.isPending,
    isBuyingPlayer: buyPlayerMutation.isPending,
    isRemovingListing: removeListingMutation.isPending,

    createListingError: createListingMutation.error?.message,
    buyPlayerError: buyPlayerMutation.error?.message,
    removeListingError: removeListingMutation.error?.message,
  };
};
