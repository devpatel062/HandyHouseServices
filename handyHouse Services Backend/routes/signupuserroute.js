const express = require("express");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating authentication tokens
const router = express.Router();
const User = require("../models/signupUser")


const validateemail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|edu|net|org|gov|io|in|us)$/;
  return emailRegex.test(email);
}


router.post("/signup", async (req, res) => {
  try {
    const { firstname,lastname, email, password } = req.body;
    
    if (validateemail(email)) {
      const newUser = new User({ firstname,lastname, email, password });
      
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

  

      await newUser.save();
      res.status(201).json({ message: "User registered successfully!",
        user: { firstname, lastname, email }
       });

    }
    else {
      res.status(500).json({ message: "This is not a valid email"});
    }

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;