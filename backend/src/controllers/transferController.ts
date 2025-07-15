import { Request, Response } from 'express';
import { TransferService } from '../services/transferService';
import {
  AuthenticatedRequest,
  CreateTransferListingRequest,
  BuyPlayerRequest,
  TransferMarketFilters,
} from '../types/index';

export class TransferController {
  private transferService: TransferService;

  constructor() {
    this.transferService = new TransferService();
  }

  getMarketListings = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: TransferMarketFilters = req.query;
      const listings = await this.transferService.getMarketListings(filters);

      res.status(200).json({
        success: true,
        data: listings,
        message: 'Market listings retrieved successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get listings',
      });
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
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create listing',
      });
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
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Purchase failed',
      });
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
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user listings',
      });
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
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove listing',
      });
    }
  };
}
