const express = require("express");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating authentication tokens
const User = require("../models/signupUser");
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// User Login Route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    // Set the token in an HTTP-only cookie
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
        sameSite: "Strict", // Prevent CSRF attacks
        maxAge: 60 * 60 * 1000, // 1 hour
      })
      .json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
