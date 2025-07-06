const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'foods', required: true }
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
