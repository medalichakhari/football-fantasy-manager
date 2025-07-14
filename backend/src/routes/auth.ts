import { Router, Request, Response } from 'express';

const router = Router();

router.post('/register', (_req: Request, res: Response) => {
  res.json({ success: false, message: 'Route under construction' });
});

router.post('/login', (_req: Request, res: Response) => {
  res.json({ success: false, message: 'Route under construction' });
});

export default router;
