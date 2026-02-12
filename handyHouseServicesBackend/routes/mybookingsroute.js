const express = require("express");
const router = express.Router();
const Booking = require("../models/complains");
const authenticateUser = require("./authenticateroute")

router.get("/mybookings", authenticateUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.user.email });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

router.delete("/mybookings/:id", authenticateUser, async (req, res) => {
  try {
    const bookingId = req.params.id;
    // Find and delete the booking only if it belongs to the authenticated user
    const deletedBooking = await Booking.findOneAndDelete({ _id: bookingId, email: req.user.email });

    if (!deletedBooking) {
      // If no booking found, it either doesn't exist or doesn't belong to this user
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Error cancelling booking" });
  }
});

module.exports = router;

