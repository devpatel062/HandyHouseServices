const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Stripe webhook MUST get raw body (ONLY for this route)
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// ✅ JSON parsing for all other routes
app.use(express.json());

app.use(cookieParser());

const servicesRoute = require("./routes/servicesRoute");
app.use("/api", servicesRoute);

const getServiceProviderRoute = require("./routes/getServiceProviderroute");
app.use("/api", getServiceProviderRoute);

const signupuserRoute = require("./routes/signupuserroute");
app.use("/api", signupuserRoute);

const loginUserRoute = require("./routes/loginUserroute");
app.use("/api", loginUserRoute);

const getuserRoute = require("./routes/getuserroute");
app.use("/api", getuserRoute);

const deleteUserRoute = require("./routes/deleteUserroute");
app.use("/api", deleteUserRoute);

const myBookingsRoute = require("./routes/mybookingsroute");
app.use("/api", myBookingsRoute);

// ✅ Mount payment routes under /api/payments
const paymentRoute = require("./routes/paymentRoute");
app.use("/api/payments", paymentRoute);

const locationAnalyticsRoute = require("./routes/locationAnalyticsRoute");
app.use("/api", locationAnalyticsRoute);

const chatbotRoute = require("./routes/geminiUtilityroute");
app.use("/api", chatbotRoute);

const logoutRoute = require("./routes/logoutroute");
app.use("/api", logoutRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("MongoDB Connected with Mongoose!");
});

const PORT = process.env.PORT || 5001;

// Export for Vercel (serverless)
module.exports = app;

// Only listen when running locally (node index.js)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
