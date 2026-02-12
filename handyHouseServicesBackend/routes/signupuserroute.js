const express = require("express");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating authentication tokens
const router = express.Router();
const User = require("../models/signupUser");

const validateemail = (email) => {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|edu|net|org|gov|io|in|us)$/;
  return emailRegex.test(email);
};

router.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    console.log("Signup Request Received:", { firstname, lastname, email }); // Log input

    if (validateemail(email)) {
      
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        console.log("User already exists:", email);
        return res.status(400).json({ message: "User already exists" });
      }
      
      const newUser = new User({ firstname, lastname, email, password });
      await newUser.save();
      console.log("User saved successfully:", newUser._id);
      res
        .status(201)
        .json({
          message: "User registered successfully!",
          user: { firstname, lastname, email },
        });
    } else {
      console.log("Invalid Email Format:", email);
      res.status(400).json({ message: "This is not a valid email" });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
