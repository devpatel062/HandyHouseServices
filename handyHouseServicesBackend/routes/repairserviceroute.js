const express = require("express");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating authentication tokens
const Booking = require("../models/repairServices");
const router = express.Router();
const sendEmail = require("./sendEmail")

router.post("/repairServices", async (req,res) => {
    console.log("ok ok")
    try {
        const {fullname,address,contact,email,problem,date } = req.body
        console.log(req.body)
        const newbooking = new Booking({fullname,address,contact,email,problem,date})
        console.log(newbooking)

        try {
            await newbooking.save();
            console.log("Booking Saved Successfully");
        } catch (dbError) {
            console.error("Error Saving to DB:", dbError);
            return res.status(500).json({ message: "Failed to save booking", error: dbError });
        }
        console.log("sfsdfsdddddddddddddd")
        
        try {
            sendEmail(email, req.body);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }
        res.status(201).json({message: "Service booked successfully!"})
        
    }catch (error) {
        res.status(500).json({message: "Failed to register",error});
    }
});

module.exports = router