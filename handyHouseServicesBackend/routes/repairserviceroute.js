const express = require("express");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating authentication tokens
const Booking = require("../models/repairServices");
const router = express.Router();
const sendEmail = require("./sendEmail")

router.post("/repairServices", async (req,res) => {
    try {
        const {fullname,address,contact,email,problem,date } = req.body
        console.log(req.body)
        const newbooking = new Booking({fullname,address,contact,email,problem,date})
        console.log(newbooking)
        await newbooking.save()
        console.log("sfsdfsdddddddddddddd")
        
        sendEmail(email,req.body)
        res.status(201).json({message: "Service booked successfully!"})
        
    }catch (error) {
        res.status(500).json({message: "Failed to register",error});
    }
});

module.exports = router