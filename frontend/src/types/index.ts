export * from "./auth";
export * from "./team";
export * from "./transfer";

export interface QueryOptions {
  enabled?: boolean;
  retry?: number;
  staleTime?: number;
  cacheTime?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  search?: string;
  position?: string;
  team?: string;
  minPrice?: number;
  maxPrice?: number;
}
