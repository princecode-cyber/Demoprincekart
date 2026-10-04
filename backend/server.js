// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable cross-origin resource sharing and JSON parsing parsing modules
app.use(cors());
app.use(express.json());

// In-Memory Data Store Mockup Repository
let products = [
  { 
    id: 1,
    name: "Cyber Onyx Running Shoes", 
    price: 390, 
    description: "Advanced insulated outer shell with reactive premium sole tech.", 
    category: "Footwear", 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" 
  },
  { 
    id: 2,
    name: "Minimalist Matte Smartwatch", 
    price: 1300, 
    description: "Amphibious design language, titanium casing, 14-day hybrid performance battery.", 
    category: "Electronics", 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600" 
  },
  { 
    id: 3,
    name: "Premium Cyber Obsidian Jacket", 
    price: 1290, 
    description: "Ultra-light breathable knit mesh upper with metallic matte zipper detailing.", 
    category: "Apparel", 
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600" 
  }
];

// ----------------------------------------------------
// AUTHENTICATION INTERACTIVE LOGIC PIPELINES
// ----------------------------------------------------

app.post('/api/auth/submit', (req, res) => {
  const { username, password, role, brandName } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing vital identity credentials." });
  }

  // Dual Profile Account Routing Evaluation
  if (role === 'partner' && !brandName) {
    return res.status(400).json({ success: false, message: "Corporate Brand Title required for initialization." });
  }

  // Simulate server side parsing wrapper
  res.status(200).json({
    success: true,
    message: "Security Matrix Profile Handshake Established.",
    user: {
      name: username,
      role: role,
      brand: role === 'partner' ? brandName : null
    }
  });
});

// ----------------------------------------------------
// MARKETPLACE INTERACTIVE CATALOG LOGIC PIPELINES
// ----------------------------------------------------

// Fetch all available products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Partner Gatekeeper Endpoint: Add brand stock item to live global catalog array map
app.post('/api/products/partner-add', (req, res) => {
  const { name, price, description, category, image, vendorBrand } = req.body;

  // Enforce secure partner identity constraints before compilation injections
  if (!vendorBrand) {
    return res.status(403).json({ success: false, message: "Action Restricted. Corporate Partner permissions missing." });
  }

  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: "Core product properties are missing." });
  }

  const newProduct = {
    id: products.length + 1,
    name: `${name} [by ${vendorBrand}]`,
    price: Number(price),
    description: description || "Premium authentic gear managed through certified partner hubs.",
    category: category,
    image: image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600"
  };

  products.push(newProduct);
  res.status(201).json({ success: true, message: "Product injected into global mapping catalog.", product: newProduct });
});

// ----------------------------------------------------
// SERVER INITIALIZATION LISTENER LOOP
// ----------------------------------------------------
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 PRINCEKART CORE SECURE CORE ENGINE ONLINE      `);
  console.log(`📡 BACKEND HOST ARCHITECTURE LIVE AT: http://localhost:${PORT}`);
  console.log(`===================================================`);
});