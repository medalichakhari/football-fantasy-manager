import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateMultiple } from '../middleware/validation';
import { AuthSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../validation';

const router = Router();
const authController = new AuthController();

router.post('/authenticate', validateMultiple({ body: AuthSchema }), authController.authenticate);
router.post(
  '/forgot-password',
  validateMultiple({ body: ForgotPasswordSchema }),
  authController.forgotPassword
);
router.post(
  '/reset-password',
  validateMultiple({ body: ResetPasswordSchema }),
  authController.resetPassword
);
router.get('/profile', authenticateToken, authController.profile);
router.post('/refresh-token', authenticateToken, authController.refreshToken);

export default router;
