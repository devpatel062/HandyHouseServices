const express = require("express");
const router = express.Router();
const User = require("../models/signupUser");
const authenticateUser = require("./authenticateroute")


router.get("/user", authenticateUser, async (req, res) => {
    console.log("User route hit");
    console.log("Decoded user from token:", req.user);
    const userId = req.user.id;
    try {
      const user = await User.findById(userId).select("email firstname lastname");
      console.log("User found:", user);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({ username: user.firstname +" "+ user.lastname, email: user.email, });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;