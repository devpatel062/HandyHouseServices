// routes/provider.js or similar
const express = require('express');
const router = express.Router();
const Provider = require('../models/provider'); // Adjust the path as necessary
const mongoose = require('mongoose');

// GET /api/providers?serviceType=Plumber
// router.get('/providers', async (req, res) => {
//   console.log("Providers route hit", req.query.serviceType)
//   try {
//     const { serviceType } = req.query;
//     const providers = await Provider.find();
//     res.status(200).json(providers);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// });

// routes/provider.js
router.get('/providers', async (req, res) => {
  console.log("Providers route hit"); // Should appear in console
  try {
    const providers = await Provider.find(); // No filter
    console.log("Providers found:", providers); // Log result
    res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
