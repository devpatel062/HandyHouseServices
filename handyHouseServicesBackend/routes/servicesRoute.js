const express = require("express");
const router = express.Router();
const Services = require("../models/services");

// Route to get all services
router.get("/services", async (req, res) => {
    try {
        const services = await Services.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch services", error });
    }
});