import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer-Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const userId = req.user ? req.user._id : "unknown_user";
    return {
      folder: "SkillSync_Avatars",
      allowed_formats: ["jpeg", "png", "jpg"],
      public_id: `avatar-${userId}-${Date.now()}`,
      transformation: [
        { width: 250, height: 250, crop: "fill", gravity: "face" },
      ],
    };
  },
});

const upload = multer({ storage });

export default upload;
