// Middleware to authenticate user from token
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;


const authenticateUser = (req, res, next) => {
    console.log("asde")
    const token = req.cookies.token; // Get token from cookies
    console.log(token)
    if (!token) return res.status(401).json({ message: "Unauthorized" });
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY); // Verify token + retrieve data
      req.user = decoded; // Store user info
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid Token" });
    }
  };

module.exports = authenticateUser