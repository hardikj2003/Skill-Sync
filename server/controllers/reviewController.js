import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, bookingId } = req.body;
  const menteeId = req.user._id;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.mentee.toString() !== menteeId.toString()) {
    res.status(401);
    throw new Error('User not authorized to review this booking');
  }

  if (booking.status !== 'completed') {
    res.status(400);
    throw new Error('Booking is not completed yet');
  }

  if (booking.hasBeenReviewed) {
    res.status(400);
    throw new Error('Booking has already been reviewed');
  }

  const review = await Review.create({
    booking: bookingId,
    mentor: booking.mentor,
    mentee: menteeId,
    rating,
    comment,
  });

  if (review) {
    booking.hasBeenReviewed = true;
    await booking.save();
    res.status(201).json(review);
  } else {
    res.status(400);
    throw new Error('Invalid review data');
  }
});

// @desc    Get all reviews for a mentor
// @route   GET /api/reviews/mentor/:mentorId
// @access  Public
const getReviewsForMentor = asyncHandler(async (req, res) => {
  const { mentorId } = req.params;

  const reviews = await Review.find({ mentor: mentorId }).populate('mentee', 'name avatar');

  res.json(reviews);
});

export { createReview, getReviewsForMentor };
