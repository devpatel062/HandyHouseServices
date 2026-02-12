const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    serviceType: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    availability: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    price: {
            type: Number,
            required: true,
            trim: true,
            unique: false
    },
    
    });

    module.exports = mongoose.model('serviceprovider', providerSchema);
    