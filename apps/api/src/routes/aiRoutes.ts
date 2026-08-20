import { Router } from 'express';
import { getAiRecommendation } from '../controllers/aiController.js';

const router = Router();

router.post('/recommend', getAiRecommendation);

export default router;
