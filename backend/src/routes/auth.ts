import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

const router = Router();
const authController = new AuthController();

const authSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
});

router.post('/auth', validate(authSchema), authController.authenticate);
router.get('/profile', authenticateToken, authController.profile);
router.post('/refresh-token', authenticateToken, authController.refreshToken);

export default router;
