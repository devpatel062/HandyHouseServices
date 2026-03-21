const express = require("express");
const router = express.Router();
const Booking = require("../models/complains");
const User = require("../models/signupUser");
const authenticateUser = require("./authenticateroute")
const { sendCancellationEmail } = require("./sendEmail");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getUserEmailRegex = async (userId) => {
  const user = await User.findById(userId).select("email");
  if (!user?.email) return null;

  const normalizedEmail = user.email.trim();
  return new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i");
};

router.get("/mybookings", authenticateUser, async (req, res) => {
  try {
    const emailRegex = await getUserEmailRegex(req.user.id);
    if (!emailRegex) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await Booking.find({ email: emailRegex }).sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

router.delete("/mybookings/:id", authenticateUser, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const emailRegex = await getUserEmailRegex(req.user.id);
    if (!emailRegex) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find and delete the booking only if it belongs to the authenticated user
    const deletedBooking = await Booking.findOneAndDelete({ _id: bookingId, email: emailRegex });

    if (!deletedBooking) {
      // If no booking found, it either doesn't exist or doesn't belong to this user
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    try {
        // Send cancellation email
      await sendCancellationEmail(deletedBooking.email, deletedBooking);
        console.log("Cancellation email sent successfully");
    } catch (emailError) {
        console.error("Error sending cancellation email:", emailError);
        // Continue even if email fails
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Error cancelling booking" });
  }
});

module.exports = router;

