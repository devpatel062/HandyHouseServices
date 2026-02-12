const express = require("express");
const router = express.Router();
const User = require("../models/signupUser");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;


router.delete("/deleteuser", async (req, res) => {
  console.log("Delete user route hit");
  const user = jwt.verify(req.cookies.token, SECRET_KEY);

  if (!user) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(user.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.
    clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    }).
    status(200).json({ message: "User deleted successfully" });
    
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;