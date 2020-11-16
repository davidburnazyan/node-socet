const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const decode = jwt.verify(req.headers.authorization, process.env.JWT_KEY)
        req.userData = decode;
        next()
    } catch {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}
