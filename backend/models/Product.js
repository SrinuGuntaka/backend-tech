const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true }, // Added brand field
  rating: { type: Number, default: 0 },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  category: { type: String, enum: ['men', 'women', 'kids'], required: true },
  image: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Product', ProductSchema);
