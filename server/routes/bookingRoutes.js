// In server/routes/bookingRoutes.js

import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the 'protect' middleware to all booking routes
router.route('/').post(protect, createBooking).get(protect, getMyBookings);
router.route('/:id').put(protect, updateBookingStatus);

export default router;