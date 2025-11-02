import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import upload from '../utils/cloudinary.js';

const router = express.Router();

router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  if (req.file) {
    res.status(200).json({
      message: 'Avatar uploaded successfully',
      imageUrl: req.file.path,
    });
  } else {
    res.status(400).json({ message: 'No file uploaded or file type invalid' });
  }
});

export default router;