const mongoose = require('mongoose');

const services = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    service: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    description: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    price: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
})

module.exports = mongoose.model("repairservices", services);