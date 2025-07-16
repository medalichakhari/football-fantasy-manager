import { Router } from 'express';
import { TransferController } from '../controllers/transferController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();
const transferController = new TransferController();

const createListingSchema = z.object({
  playerId: z.string(),
  price: z.number().positive('Price must be positive'),
});

const buyPlayerSchema = z.object({
  transferListingId: z.string(),
});

router.get('/market', transferController.getMarketListings);
router.get('/my-listings', authenticateToken, transferController.getUserListings);
router.post(
  '/market',
  authenticateToken,
  validate(createListingSchema),
  transferController.createListing
);
router.post('/buy', authenticateToken, validate(buyPlayerSchema), transferController.buyPlayer);
router.delete('/listings/:listingId', authenticateToken, transferController.removeListing);

export default router;
