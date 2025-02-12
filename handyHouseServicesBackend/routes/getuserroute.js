const express = require("express");
const router = express.Router();
const User = require("../models/signupUser");
const authenticateUser = require("./authenticateroute")

router.get("/user", authenticateUser, async (req, res) => {
    console.log("ok")
    try {
      const user = await User.findById(req.user.id).select("firstname email");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({ username: user.username, email: user.email });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;