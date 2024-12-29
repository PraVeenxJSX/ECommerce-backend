const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const User = require('../models/User');
const jwt = require("jsonwebtoken");
require("dotenv").config(); // To access .env variables


const router = express.Router();

// Sign Up

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Sign In

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);


// POST /api/auth/admin - Admin Authentication
router.post("/admin", (req, res) => {
  const { adminKey } = req.body;

  if (!adminKey) {
    return res.status(400).json({ message: "Admin key is required." });
  }

  // Verify the admin key
  if (adminKey === process.env.ADMIN_SECRET) {
    return res.status(200).json({ message: "Access granted. Welcome, Admin!" });
  } else {
    return res.status(403).json({ message: "Access denied. Invalid key." });
  }
});

module.exports = router;
