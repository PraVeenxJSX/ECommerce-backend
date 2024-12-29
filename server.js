const express = require("express");
const cors = require("cors");
const allProducts = require("./data/allProducts");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");


const app = express();



// Middleware
app.use(cors());
app.use(express.json());
require("dotenv").config();
connectDB();
app.use(express.json());
app.use("/api/auth", authRoutes);

// API Endpoints

// Get all products
app.get("/api/products", (req, res) => {
  res.json(allProducts);
});

// Get products by category
app.get("/api/products/:category", (req, res) => {
  const category = req.params.category.toLowerCase();
  const filteredProducts = allProducts.filter(
    (product) => product.category.toLowerCase() === category
  );

  if (filteredProducts.length > 0) {
    res.json(filteredProducts);
  } else {
    res.status(404).json({ message: "No products found for this category." });
  }
});

// Get product by ID
app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = allProducts.find((product) => product.id === id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// Get products by category
app.get("/api/products", (req, res) => {
  const category = req.query.category?.toLowerCase(); // Using query params for filtering
  if (category) {
    const filteredProducts = allProducts.filter(
      (product) => product.category.toLowerCase() === category
    );

    if (filteredProducts.length > 0) {
      return res.json(filteredProducts);
    } else {
      return res.status(404).json({ message: "No products found for this category." });
    }
  }
  
  // If no category is provided, return all products
  res.json(allProducts);
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
