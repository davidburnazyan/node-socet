const mongoose = require('mongoose');

const Message = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    message: {
        type: String,
        march: /^[0-9a-zA-Z!@#$%^&*(),.?":{}<>]{1,150}$/,
        required: true
    },
    byProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product"},
    byUser: { type:  mongoose.Schema.Types.ObjectId, ref: "User"},
    create_at: {
        type: Date
    }
})

module.exports = mongoose.model('Message',Message)