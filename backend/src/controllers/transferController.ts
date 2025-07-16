import { Request, Response } from 'express';
import { TransferService } from '../services/transferService';
import {
  AuthenticatedRequest,
  CreateTransferListingRequest,
  BuyPlayerRequest,
  TransferMarketFilters,
} from '../types/index';
import { handleError } from '../utils/errorHandler';
import { MarketListingsQuery } from '../validation/transferValidation';

export class TransferController {
  private transferService: TransferService;

  constructor() {
    this.transferService = new TransferService();
  }

  getMarketListings = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedQuery = req.query as unknown as MarketListingsQuery;

      const filters: TransferMarketFilters = {
        ...(validatedQuery.position && { position: validatedQuery.position }),
        ...(validatedQuery.search && { search: validatedQuery.search }),
        ...(validatedQuery.minPrice !== undefined && { minPrice: validatedQuery.minPrice }),
        ...(validatedQuery.maxPrice !== undefined && { maxPrice: validatedQuery.maxPrice }),
        page: validatedQuery.page,
        limit: validatedQuery.limit,
      };

      const listings = await this.transferService.getMarketListings(filters);

      res.status(200).json({
        success: true,
        data: listings,
        message: 'Market listings retrieved successfully',
        meta: {
          page: filters.page,
          limit: filters.limit,
          appliedFilters: {
            ...(filters.position && { position: filters.position }),
            ...(filters.search && { search: filters.search }),
            ...(filters.minPrice && { minPrice: filters.minPrice }),
            ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          },
        },
      });
    } catch (error) {
      handleError(res, error, 'Failed to retrieve market listings', 400);
    }
  };

  createListing = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthenticatedRequest).user.userId;
      const listingData: CreateTransferListingRequest = req.body;
      const listing = await this.transferService.createListing(userId, listingData);

      res.status(201).json({
        success: true,
        data: listing,
        message: 'Transfer listing created successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to create listing', 400);
    }
  };

  buyPlayer = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthenticatedRequest).user.userId;
      const buyData: BuyPlayerRequest = req.body;
      const result = await this.transferService.buyPlayer(userId, buyData);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Player purchased successfully',
      });
    } catch (error) {
      handleError(res, error, 'Purchase failed', 400);
    }
  };

  getUserListings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthenticatedRequest).user.userId;
      const listings = await this.transferService.getUserListings(userId);

      res.status(200).json({
        success: true,
        data: listings,
        message: 'User listings retrieved successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to get user listings', 400);
    }
  };

  removeListing = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthenticatedRequest).user.userId;
      const { listingId } = req.params;
      await this.transferService.removeListing(userId, listingId);

      res.status(200).json({
        success: true,
        message: 'Listing removed successfully',
      });
    } catch (error) {
      handleError(res, error, 'Failed to remove listing', 400);
    }
  };
}
