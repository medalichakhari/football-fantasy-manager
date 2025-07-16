export interface TransferListing {
  id: string;
  playerId: string;
  sellerId: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  player: {
    id: string;
    name: string;
    position: string;
    team: string;
    price: number;
    skill: number;
    age: number;
    nationality: string;
  };
  seller: {
    id: string;
    email: string;
  };
}

export interface TransferMarketResponse {
  listings: TransferListing[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface TransferMarketFilters {
  position?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateTransferListingRequest {
  playerId: string;
  price: number;
}

export interface BuyPlayerRequest {
  transferListingId: string;
}

export interface BuyPlayerResponse {
  success: boolean;
  transfer: {
    buyerId: string;
    sellerId: string;
    playerId: string;
    price: number;
    finalPrice: number;
  };
  updatedBudgets: {
    buyer: number;
    seller: number;
  };
}
