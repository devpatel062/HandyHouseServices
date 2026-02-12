const express = require('express');
const router = express.Router();
const { getServiceRecommendation } = require('../utils/geminiUtility');
const Service = require('../models/services'); // Adjust path if needed

router.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    // Fetch all services from DB
    const services = await Service.find().select('service');
    const availableServices = services.map(s => s.service);

    // Get recommendation from Gemini
    const recommendation = await getServiceRecommendation(message, availableServices);
    // console.log('Chatbot Recommendation:', recommendation);
    res.json({ recommendation });
  } catch (err) {
    console.error('Chatbot Error:', err);
    res.status(500).json({ error: 'Failed to get recommendation' });
  }
});

module.exports = router;