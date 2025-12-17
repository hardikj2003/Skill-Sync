import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllMentors,
  getMentorById,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- PROTECTED ROUTES (Login Required) ---
// Keep these protected. Users must be logged in to change their own profile.
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// --- PUBLIC ROUTES (No Login Required) ---
// I removed 'protect' from here. Now the frontend can fetch this data without a 401 error.
router.route("/mentors").get(getAllMentors);
router.route("/mentors/:id").get(getMentorById);

export default router;
