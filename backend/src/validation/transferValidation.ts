import { z } from 'zod';

const PositionSchema = z.enum(['GK', 'DEF', 'MID', 'ATT'] as const);

export const MarketListingsQuerySchema = z
  .object({
    position: PositionSchema.optional(),
    search: z
      .string()
      .trim()
      .max(100, 'Search term cannot exceed 100 characters')
      .optional()
      .transform(val => (val === '' ? undefined : val)),
    minPrice: z
      .string()
      .optional()
      .transform(val => (val ? parseInt(val, 10) : undefined))
      .refine(val => val === undefined || (!isNaN(val) && val >= 0), {
        message: 'Min price must be a non-negative number',
      }),
    maxPrice: z
      .string()
      .optional()
      .transform(val => (val ? parseInt(val, 10) : undefined))
      .refine(val => val === undefined || (!isNaN(val) && val >= 0), {
        message: 'Max price must be a non-negative number',
      }),
    page: z
      .string()
      .optional()
      .transform(val => (val ? parseInt(val, 10) : 1))
      .refine(val => !isNaN(val) && val >= 1 && val <= 1000, {
        message: 'Page must be between 1 and 1000',
      })
      .default('1'),
    limit: z
      .string()
      .optional()
      .transform(val => (val ? parseInt(val, 10) : 20))
      .refine(val => !isNaN(val) && val >= 1 && val <= 100, {
        message: 'Limit must be between 1 and 100',
      })
      .default('20'),
  })
  .refine(
    data => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: 'Min price cannot be greater than max price',
      path: ['minPrice'],
    }
  );

export const CreateListingSchema = z.object({
  playerId: z.string(),
  price: z
    .number()
    .min(1, 'Price must be at least 1')
    .max(1000000000, 'Price cannot exceed 1 billion'),
});

export const BuyPlayerSchema = z.object({
  transferListingId: z.string(),
});

export const RemoveListingParamsSchema = z.object({
  listingId: z.string(),
});

export type MarketListingsQuery = z.infer<typeof MarketListingsQuerySchema>;
export type CreateListingBody = z.infer<typeof CreateListingSchema>;
export type BuyPlayerBody = z.infer<typeof BuyPlayerSchema>;
export type RemoveListingParams = z.infer<typeof RemoveListingParamsSchema>;
