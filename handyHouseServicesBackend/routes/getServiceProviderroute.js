const express = require('express');
const router = express.Router();
const Provider = require('../models/provider');
const mongoose = require('mongoose');

// GET /api/providers?service=Plumber
router.get('/providers', async (req, res) => {
  const service = req.query.serviceType;
  console.log("Providers route hit", service);

  if (!service) {
    return res.status(400).json({ message: 'Service type is required' });
  }
  
  try {
    
    const providers = await Provider.find({
      service: { $regex: new RegExp(service, 'i') }
    });
    
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
