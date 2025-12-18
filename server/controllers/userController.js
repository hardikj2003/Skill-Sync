// File: server/controllers/userController.js

import User from "../models/User.js";
import Review from "../models/Review.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
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
      // Use 'expertise' as per your schema
      user.expertise = req.body.expertise || user.expertise;
      user.availability = req.body.availability || user.availability;
    } else {
      user.learningGoals = req.body.learningGoals || user.learningGoals;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Get all users with the role of 'mentor' (With Search & Filter)
// @route   GET /api/users/mentors
// @access  Public (or Private, depending on your auth setup)
const getAllMentors = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const { search, skill } = req.query;

    let matchQuery = { role: "mentor" };
    if (search) {
      matchQuery.name = { $regex: search, $options: "i" };
    }
    if (skill) {
      matchQuery.expertise = { $regex: skill, $options: "i" };
    }

    const aggregationPipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "mentor",
          as: "reviews",
        },
      },
      {
        $addFields: {
          reviewCount: { $size: "$reviews" },
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          expertise: 1,
          title: 1,
          bio: 1,
          avatar: 1,
          reviewCount: 1,
          averageRating: 1,
        },
      },
    ];

    const mentors = await User.aggregate(aggregationPipeline)
      .skip(skip)
      .limit(limit);

    const count = await User.countDocuments(matchQuery);

    res.json({
      mentors,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalMentors: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get a single mentor by ID
// @route   GET /api/users/mentors/:id
// @access  Private
const getMentorById = async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id).select(
      "_id name role email expertise availability title bio avatar"
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

export { getUserProfile, updateUserProfile, getAllMentors, getMentorById };
