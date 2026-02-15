const express = require("express");
const Booking = require("../models/complains");
const { sendConfirmationEmail: sendEmail } = require("./sendEmail");

const complains = async (info) => {
    console.log("ok ok")
    try {
        const {fullname,address,contact,email,problem,date,serviceProvidername, serviceProvideremail, serviceProvidernumber, serviceProviderrating,price } = info
        const newbooking = new Booking({fullname,address,contact,email,problem,date, serviceProvidername, serviceProvideremail, serviceProvidernumber, serviceProviderrating,price });
        console.log(newbooking)

        try {
            await newbooking.save();
            console.log("Booking Saved Successfully");
        } catch (dbError) {
            console.error("Error Saving to DB:", dbError);
            return { success: false, message: "Failed to save booking", error: dbError };
        }
       
        
        try {
            sendEmail(email, info);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }
        // res.status(201).json({message: "Service booked successfully!"})
        
    }catch (error) {
        return {message: "Failed to register",error};
    }
};

module.exports = complains;