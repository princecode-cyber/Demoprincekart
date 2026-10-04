// backend/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String, required: true }], // Holds URLs of high-quality images
  stock: { type: Number, default: 10 }
});

module.exports = mongoose.model('Product', ProductSchema);