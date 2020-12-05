const mongoose = require('mongoose');
const Client = require('../../models/client');
const requestIp = require('request-ip');


module.exports = {
    post: (req, res, next) => {

        const string = JSON.stringify({
            "user-agent": req.headers['user-agent'],
            ipOne: req.connection.remoteAddress,
            ipTwo: requestIp.getClientIp(req)

        })

        const newClient = new Client({
            _id: mongoose.Types.ObjectId(),
            clientInfo: string,
            created_at: new Date()
        })

        newClient.save()
            .then(msg => res.status(200).json({ message: "Done" }))
            .catch(error => {
                res.status(500).json({ error })
            })
    },
}