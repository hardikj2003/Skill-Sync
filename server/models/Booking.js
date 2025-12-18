// In server/models/Booking.js

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Creates a reference to the User model
    index: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Creates a reference to the User model
    index: true,
  },
  sessionDate: {
    type: Date,
    required: true,
  },
  sessionTimeSlot: { // e.g., "10:00 - 10:30"
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'rejected', 'completed'],
    default: 'pending',
  },
  userMessage: { // A brief message from the mentee
    type: String,
  },
  hasBeenReviewed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;