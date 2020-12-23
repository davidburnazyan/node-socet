const mongoose = require('mongoose');
const Client = require('../../models/client');
const requestIp = require('request-ip');
const os = require("os")
// const requestIp = require("request-ip");
// const ip = require("ip");
// console.log(req.headers["x-forwarded-for"]);
// console.log(req.connection.remoteAddress);
// console.log(req.socket.remoteAddress);
// console.log(requestIp.getClientIp(req));


module.exports = {
    post: (req, res, next) => {
        const { networkInterfaces } = require("os");
        const nets = networkInterfaces();
        const results = Object.create(null); // Or just '{}', an empty object
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === "IPv4" && !net.internal) {
                    if (!results[name]) {
                        results[name] = [];
                    }
                    results[name].push(net.address);
                }
            }
        }

        console.log(results)

        const string = JSON.stringify({
            "user-agent": "",
            ipOne: results,
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