import express from 'express';
import {
  createReview,
  getReviewsForMentor,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createReview);
router.route('/mentor/:mentorId').get(getReviewsForMentor);

export default router;
