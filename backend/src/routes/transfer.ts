import { Router, Request, Response } from 'express';

const router = Router();

router.get('/market', (_req: Request, res: Response) => {
  res.json({ success: false, message: 'Route under construction' });
});

router.post('/market', (_req: Request, res: Response) => {
  res.json({ success: false, message: 'Route under construction' });
});

router.post('/buy/:id', (_req: Request, res: Response) => {
  res.json({ success: false, message: 'Route under construction' });
});

export default router;
