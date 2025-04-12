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
    }
});

module.exports = mongoose.model("complains",repairServicesschema);