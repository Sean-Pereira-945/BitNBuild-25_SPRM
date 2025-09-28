const express = require('express');
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const router = express.Router();

// POST /api/upload/image
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  // Save file to disk (public/uploads)
  const uploadDir = path.join(__dirname, '../../public/uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const filename = `${Date.now()}_${req.file.originalname}`;
  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, req.file.buffer);
  // Return public URL
  const publicUrl = `/uploads/${filename}`;
  res.json({ success: true, url: publicUrl });
});

module.exports = router;
