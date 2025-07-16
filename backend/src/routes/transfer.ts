import { Router } from 'express';
import { TransferController } from '../controllers/transferController';
import { authenticateToken } from '../middleware/auth';
import { validateMultiple } from '../middleware/validation';
import {
  MarketListingsQuerySchema,
  CreateListingSchema,
  BuyPlayerSchema,
  RemoveListingParamsSchema,
} from '../validation';

const router = Router();
const transferController = new TransferController();

router.get(
  '/market',
  validateMultiple({ query: MarketListingsQuerySchema }),
  transferController.getMarketListings
);
router.get('/my-listings', authenticateToken, transferController.getUserListings);
router.post(
  '/market',
  authenticateToken,
  validateMultiple({ body: CreateListingSchema }),
  transferController.createListing
);
router.post(
  '/buy',
  authenticateToken,
  validateMultiple({ body: BuyPlayerSchema }),
  transferController.buyPlayer
);
router.delete(
  '/listings/:listingId',
  authenticateToken,
  validateMultiple({ params: RemoveListingParamsSchema }),
  transferController.removeListing
);

export default router;
