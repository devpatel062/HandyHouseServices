const mongoose  = require ("mongoose");
// const bcrypt = require("bcryptjs"); 


const repairServicesschema = new mongoose.Schema({
    fullname: {
        type : String,
        required : true,
        trim : true,
        unique : false
    },

    address: {
        type : String,
        required : true,
        trim : true,
        unique : false
    },

    contact: {
        type : String,
        required : true,
        trim : true,
        unique : false
    },

    email: {
        type : String,
        required : true,
        trim : true,
        unique : false
    },

    problem: {
        type : String,
        required : true,
        trim : true,
        unique : false
    },

    date: {
        type : Date,
        required : true,
        trim : true,
        unique : false
    },
    serviceProvidername :{
        type : String,
        required : false,
        trim : true,
        unique : false
    },
    serviceProvideremail :{
        type : String,
        required : false,
        trim : true,
        unique : false
    },
    serviceProvidernumber :{
        type : String,
        required : false,
        trim : true,
        unique : false
    },
    serviceProviderrating :{
        type : Number,
        required : false,
        trim : true,
        unique : false
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending',
        required: true
    },
    price : {
        type: Number,
        required: true,
        default: 0
    },
    
});

module.exports = mongoose.model("complains",repairServicesschema);