import { Router, Request, Response } from 'express';

const router = Router();

router.get('/my-team', (_req: Request, res: Response) => {
  res.json({ success: false, message: 'Route under construction' });
});

export default router;
