const express = require('express');
const router = express.Router();
const ComplaintController = require('../Controllers/ComplaintController');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Inline middleware to verify token and get user ID (like CartRoute)
const getUserIdFromToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Multer memory storage for file upload to Supabase
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/complaints - Submit a new complaint (image upload handled in controller)
router.post('/', getUserIdFromToken, upload.single('image'), ComplaintController.submitComplaint);

// GET /api/complaints - Get all complaints for the logged-in user
router.get('/', getUserIdFromToken, ComplaintController.getUserComplaints);

module.exports = router;
