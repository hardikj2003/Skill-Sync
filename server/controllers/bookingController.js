import Booking from "../models/Booking.js";

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private (Mentees)
const createBooking = async (req, res) => {
  console.log("INCOMING BOOKING REQUEST BODY:", req.body);
  console.log("USER MAKING REQUEST:", req.user);

  const { mentorId, sessionDate, sessionTimeSlot, userMessage } = req.body;
  const menteeId = req.user._id;

  try {
    const booking = new Booking({
      mentee: menteeId,
      mentor: mentorId,
      sessionDate,
      sessionTimeSlot,
      userMessage,
    });

    const createdBooking = await booking.save();

    // --- REAL-TIME NOTIFICATION LOGIC ---
    const io = req.io;
    const onlineUsers = req.onlineUsers;

    // Find the mentor's socket if they are online
    const mentorSocket = onlineUsers.find(
      (user) => user.userId === mentorId.toString()
    );

    if (mentorSocket) {
      io.to(mentorSocket.socketId).emit("newBookingRequest", {
        message: `You have a new session request from ${req.user.name}`,
        booking: createdBooking,
      });
      console.log(`Notification sent to mentor ${mentorId}`);
    } else {
      console.log(`Mentor ${mentorId} is not online. No notification sent.`);
    }
    // --- END OF NOTIFICATION LOGIC ---

    res.status(201).json(createdBooking);
  } catch (error) {
    console.error("!!! ERROR CREATING BOOKING:", error);
    res
      .status(500)
      .json({
        message: "Server error while creating booking.",
        error: error.message,
      });
  }
};

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    // Find bookings where the user is either the mentee OR the mentor
    const bookings = await Booking.find({
      $or: [{ mentee: userId }, { mentor: userId }],
    })
      .populate("mentor", "name email") // Populate with mentor's name and email
      .populate("mentee", "name email"); // Populate with mentee's name and email

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a booking's status (e.g., confirm/reject/complete)
// @route   PUT /api/bookings/:id
// @access  Private
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const userId = req.user._id.toString();
    const menteeId = booking.mentee.toString();
    const mentorId = booking.mentor.toString();

    console.log("--- PERMISSION CHECK ---");
    console.log("User making request (from token):", userId);
    console.log("Mentor on this booking (from DB):", mentorId);
    console.log("Mentee on this booking (from DB):", menteeId);
    console.log("Is user the mentor?", userId === mentorId);
    console.log("------------------------");

    // Improved Security Check: Allow the update if the user is either the mentee OR the mentor.
    if (userId !== menteeId && userId !== mentorId) {
      return res
        .status(401)
        .json({ message: "User not authorized to update this booking" });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    console.error("!!! ERROR UPDATING BOOKING STATUS:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export { createBooking, getMyBookings, updateBookingStatus };
