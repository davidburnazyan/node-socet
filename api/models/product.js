const mongoose = require('mongoose');

const Product  = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    dateRelease: {
        type: Date,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    images: {
        type: [String]
    },
    byUser: { type:  mongoose.Schema.Types.ObjectId, ref: "User"},
    created_at: {
        type: String
    },
    updated_at: {
        type: String
    }
})

module.exports = mongoose.model('Product',Product);