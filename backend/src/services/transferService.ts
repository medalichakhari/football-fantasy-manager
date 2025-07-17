import { prisma } from '../models/index';
import {
  TransferMarketResponse,
  TransferMarketFilters,
  CreateTransferListingRequest,
  BuyPlayerRequest,
  TransferListingWithRelations,
  BuyPlayerResponse,
} from '../types/index';

export class TransferService {
  async getMarketListings(filters: TransferMarketFilters): Promise<TransferMarketResponse> {
    const { position, minPrice, maxPrice, search, page = 1, limit = 20 } = filters;

    const skip = (page - 1) * limit;
    const whereConditions = {
      isActive: true,
      ...(position && { player: { position } }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
      ...(search && {
        player: {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { team: { contains: search, mode: 'insensitive' as const } },
          ],
        },
      }),
    };

    const [listings, totalCount] = await Promise.all([
      prisma.transferListing.findMany({
        where: whereConditions,
        include: {
          player: true,
          seller: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transferListing.count({ where: whereConditions }),
    ]);

    return {
      listings,
      totalCount,
      page,
      limit,
    };
  }

  async createListing(
    userId: string,
    data: CreateTransferListingRequest
  ): Promise<TransferListingWithRelations> {
    const { playerId, price } = data;

    const userPlayer = await prisma.userPlayer.findFirst({
      where: {
        userId,
        playerId,
      },
      include: {
        player: true,
      },
    });

    if (!userPlayer) {
      throw new Error('Player not found in your team');
    }

    const existingListing = await prisma.transferListing.findFirst({
      where: {
        sellerId: userId,
        playerId,
        isActive: true,
      },
    });

    if (existingListing) {
      throw new Error('Player is already listed for transfer');
    }

    if (price <= 0) {
      throw new Error('Price must be greater than zero');
    }

    const listing = await prisma.transferListing.create({
      data: {
        sellerId: userId,
        playerId,
        price,
        isActive: true,
      },
      include: {
        player: true,
        seller: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return listing;
  }

  async buyPlayer(userId: string, data: BuyPlayerRequest): Promise<BuyPlayerResponse> {
    const { transferListingId } = data;

    return await prisma.$transaction(async tx => {
      const listing = await tx.transferListing.findUnique({
        where: { id: transferListingId },
        include: {
          player: true,
          seller: true,
        },
      });

      if (!listing || !listing.isActive) {
        throw new Error('Transfer listing not found or inactive');
      }

      if (listing.sellerId === userId) {
        throw new Error('Cannot buy your own player');
      }

      const buyer = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!buyer) {
        throw new Error('Buyer not found');
      }

      const discountedPrice = Math.floor(listing.price * 0.95);
      const sellerReceives = discountedPrice;

      if (buyer.budget < discountedPrice) {
        throw new Error(
          `Insufficient budget. You need ${discountedPrice.toLocaleString()} but only have ${buyer.budget.toLocaleString()}`
        );
      }

      await tx.userPlayer.delete({
        where: {
          userId_playerId: {
            userId: listing.sellerId,
            playerId: listing.playerId,
          },
        },
      });

      await tx.userPlayer.create({
        data: {
          userId,
          playerId: listing.playerId,
          price: discountedPrice,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          budget: buyer.budget - discountedPrice,
        },
      });

      await tx.user.update({
        where: { id: listing.sellerId },
        data: {
          budget: listing.seller.budget + sellerReceives,
        },
      });

      await tx.player.update({
        where: { id: listing.playerId },
        data: {
          price: discountedPrice,
        },
      });

      await tx.transferListing.update({
        where: { id: transferListingId },
        data: { isActive: false },
      });

      return {
        player: {
          ...listing.player,
          price: discountedPrice,
        },
        paidPrice: discountedPrice,
        originalPrice: listing.price,
        discountApplied: listing.price - discountedPrice,
        newBudget: buyer.budget - discountedPrice,
      };
    });
  }

  async getUserListings(userId: string): Promise<TransferListingWithRelations[]> {
    const listings = await prisma.transferListing.findMany({
      where: {
        sellerId: userId,
        isActive: true,
      },
      include: {
        player: true,
        seller: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return listings;
  }

  async removeListing(userId: string, listingId: string): Promise<void> {
    const listing = await prisma.transferListing.findFirst({
      where: {
        id: listingId,
        sellerId: userId,
        isActive: true,
      },
    });

    if (!listing) {
      throw new Error('Listing not found or you do not have permission');
    }

    await prisma.transferListing.update({
      where: { id: listingId },
      data: { isActive: false },
    });
  }
}
