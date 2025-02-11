const mongoose  = require ("mongoose")
const bcrypt = require("bcryptjs"); 

const signupUser = new mongoose.Schema({
    firstname : {
        type : String,
        required : true,
        trim :true,
        unique: false
    },
    lastname : {
        type : String,
        required : true,
        trim :true,
        unique: false
    },
    password : {
        type : String,
        required : true,
        trim :true
    },
    email : {
        type : String,
        required : true,
        trim :true,
        unique: true
    },
})


signupUser.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); 
});

module.exports = mongoose.model("signupuser", signupUser);