// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Route 1: Fetch all products from database
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching products" });
  }
});

// Route 2: Seed Route (To easily insert dummy premium items for testing)
router.post('/seed', async (req, res) => {
  const dummyProducts = [
    {
      name: "Cyber Onyx Running Shoes",
      price: 180,
      description: "Ultra-light breathable knit mesh upper with reactive premium sole tech.",
      category: "Footwear",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"]
    },
    {
      name: "Minimalist Matte Smartwatch",
      price: 299,
      description: "Amphibious design language, titanium casing, 14-day hybrid performance battery.",
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"]
    }
  ];
  await Product.insertMany(dummyProducts);
  res.json({ message: "PrinceKart database successfully seeded with high-end items!" });
});

module.exports = router;