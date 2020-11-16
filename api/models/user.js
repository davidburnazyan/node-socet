const mongoose = require('mongoose');

const User  = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        march: /^(?=.{3,16}$)+[a-zA-Z]+([a-zA-Z])*$/,
        required: true
    },
    surname: {
        type: String,
        march: /^(?=.{3,16}$)+[a-zA-Z]+([a-zA-Z])*$/,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        march: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: false
    }
})

module.exports = mongoose.model("User",User);