import express from 'express';
import { getMessages } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:bookingId').get(protect, getMessages);

export default router;