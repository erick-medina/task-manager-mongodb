const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true // to remove spaces
    },
    age: {
        type: Number,
        default: 0, // to use 0 as default if user doesn't enter age
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7, // 7 characters is the minimum allowed
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error ("Password cannot contain 'password'")
            }
        }
    }
})

module.exports = User;