import express from 'express';
import { summarizeSession } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/summarize', protect, summarizeSession);

export default router;