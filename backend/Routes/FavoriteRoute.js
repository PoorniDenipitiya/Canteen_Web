const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Favorite = require('../Models/FavoriteModel');

// Middleware to get user ID from token
const getUserIdFromToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user's favorites (returns array of food IDs)
router.get('/', getUserIdFromToken, async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user.id });
  res.json(favorites.map(f => f.foodId));
});

// Toggle favorite
router.post('/toggle', getUserIdFromToken, async (req, res) => {
  const { foodId } = req.body;
  const existing = await Favorite.findOne({ userId: req.user.id, foodId });
  if (existing) {
    await Favorite.deleteOne({ _id: existing._id });
    return res.json({ liked: false });
  } else {
    await Favorite.create({ userId: req.user.id, foodId });
    return res.json({ liked: true });
  }
});

module.exports = router;
