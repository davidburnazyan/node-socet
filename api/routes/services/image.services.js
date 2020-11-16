const path = require('path');
module.exports = {
    productImage: (req, res, next) => {
        res.sendFile(path.resolve()+req.originalUrl)
    },
    userAvatar: (req, res, next) => {
        res.sendFile(path.resolve()+req.originalUrl)
    },
    defaultImage: (req, res, next) => {
        res.sendFile(path.resolve()+req.originalUrl)
    }
}