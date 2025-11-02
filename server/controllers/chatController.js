import Message from '../models/Message.js';

// @desc    Get all messages for a specific booking
// @route   GET /api/chat/:bookingId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ booking: req.params.bookingId })
      .populate('sender', 'name')
      .sort({ createdAt: 'asc' }); // Sort by oldest first

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getMessages };