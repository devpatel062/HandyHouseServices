const mongoose  = require ("mongoose")
const bcrypt = require("bcryptjs"); 

const loginuserschema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim :true,
        unique: true
    },
    password : {
        type : String,
        required : true,
        trim :true
    },
})

module.exports = mongoose.model("loginUser",loginuserschema);