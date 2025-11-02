// In server/routes/userRoutes.js

import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllMentors,
  getMentorById,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Applying the 'protect' middleware to these routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/mentors").get(protect, getAllMentors);
router.route("/mentors/:id").get(protect, getMentorById);

export default router;
