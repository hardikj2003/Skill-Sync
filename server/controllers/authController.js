// In server/controllers/authController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role, 
    });

    if (user) {
      // 4. Generate token and send response
      const token = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });

    // 2. Check if user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      // 3. Generate token and send response
      const token = generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Handle Google login/signup
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { name, email, googleId } = req.body;

  try {
    let user = await User.findOne({ email });

    // If user exists, log them in
    if (user) {
      if (user.authProvider !== "google") {
        // Optional: Update provider if they previously used credentials
        user.authProvider = "google";
        user.providerId = googleId;
        await user.save();
      }
    } else {
      // If user doesn't exist, create a new user
      user = await User.create({
        name,
        email,
        authProvider: "google",
        providerId: googleId,
        // Password is not needed for OAuth users
      });
    }

    // Generate our backend token and send response
    const token = generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error during Google login",
        error: error.message,
      });
  }
};

// Make sure to export the new function
export { registerUser, loginUser, googleLogin };
