const mongoose = require('mongoose');

const Client = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clientInfo: {
        type: String,
        required: true
    },
    created_at: {
        type: Date
    }
})

module.exports = mongoose.model('Client', Client)