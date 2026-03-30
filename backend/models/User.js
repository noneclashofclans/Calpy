const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    phone: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10,
        minlength: 10
    },

    password: {
        type: String,
        required: true,
        minlength: 4,
        match: /^(?=.*[!@#$%^&*])/
    },

}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);