const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
// const bodyParser = require("express.json");
const app = express();
app.use(cors({
  origin: 'https://handy-house-services-frontend.vercel.app', // Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// const userRoutes = require("./routes/loginUserroute");
// app.use("/api/users", userRoutes);

const signupuserRoute = require("./routes/signupuserroute");
app.use("/api", signupuserRoute);

const loginUserRoute = require("./routes/loginUserroute")
app.use("/api",loginUserRoute)

const repairServicesRoute = require("./routes/repairserviceroute")
app.use("/api",repairServicesRoute)

const getuserRoute = require("./routes/getuserroute")
app.use("/api",getuserRoute)
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Sample Route
app.get("/", (req, res) => {
  res.send("MongoDB Connected with Mongoose!");
});

const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log(`Server running on port ${PORT}`));
