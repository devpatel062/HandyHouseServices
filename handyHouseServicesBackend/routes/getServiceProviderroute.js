const express = require('express');
const router = express.Router();
const Provider = require('../models/provider');

// GET /api/providers?serviceType=Electrician
router.get('/providers', async (req, res) => {
  const serviceType = req.query.serviceType;
  console.log("Providers route hit:", serviceType);

  if (!serviceType) {
    return res.status(400).json({ message: 'Service type is required' });
  }

  try {
    const providers = await Provider.find({ serviceType: serviceType });
    if (!providers || providers.length === 0) {
      return res.status(404).json({ message: 'No providers found for this service type' });
    }

    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
