// In server/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ["google", "github", "credentials"],
      default: "credentials",
    },
    providerId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["mentee", "mentor"],
      default: "mentee",
      index: true,
    },
    avatar: { type: String, default: '' },
    bio: { type: String, default: "" }, 
    title: { type: String, default: "" }, 
    socialLinks: {
      linkedIn: { type: String, default: "" },
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    learningGoals: [String], 

    expertise: [String], 
    availability: [
      {
        day: String,
        slots: [{ start: String, end: String }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
