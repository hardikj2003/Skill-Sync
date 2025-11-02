// In server/controllers/userController.js

import User from "../models/User.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user is attached by the 'protect' middleware
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  console.log("BACKEND: Received request body to update profile:", req.body);

  if (user) {
    user.name = req.body.name || user.name;
    user.title = req.body.title || user.title;
    user.bio = req.body.bio || user.bio;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.socialLinks) {
      user.socialLinks.linkedIn =
        req.body.socialLinks.linkedIn || user.socialLinks.linkedIn;
      user.socialLinks.twitter =
        req.body.socialLinks.twitter || user.socialLinks.twitter;
      user.socialLinks.github =
        req.body.socialLinks.github || user.socialLinks.github;

      user.markModified("socialLinks");
    }

    if (user.role === "mentor") {
      user.expertise = req.body.expertise || user.expertise;
      user.availability = req.body.availability || user.availability;
    } else {
      // It's a mentee
      user.learningGoals = req.body.learningGoals || user.learningGoals;
    }

    const updatedUser = await user.save();
    // Return all fields
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Get all users with the role of 'mentor'
// @route   GET /api/users/mentors
// @access  Private (for any logged-in user)
const getAllMentors = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9; // e.g., 9 mentors per page for a 3x3 grid
    const skip = (page - 1) * limit;

    // Get the total count of mentors for pagination calculation
    const count = await User.countDocuments({ role: "mentor" });

    const mentors = await User.find({ role: "mentor" })
      .select("_id name email expertise")
      .limit(limit)
      .skip(skip);

    res.json({
      mentors,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get a single mentor by ID
// @route   GET /api/users/mentors/:id
// @access  Private
const getMentorById = async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id).select(
      "_id name role email expertise availability"
    );

    if (mentor && mentor.role === "mentor") {
      res.json(mentor);
    } else {
      res.status(404).json({ message: "Mentor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Make sure to export the new function
export { getUserProfile, updateUserProfile, getAllMentors, getMentorById };
