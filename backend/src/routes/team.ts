import { Router } from 'express';
import { TeamController } from '../controllers/teamController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const teamController = new TeamController();

router.get('/my-team', authenticateToken, teamController.getTeam);
router.post('/generate', authenticateToken, teamController.generateTeam);
router.get('/stats', authenticateToken, teamController.getTeamStats);

export default router;
