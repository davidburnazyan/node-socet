const mongoose = require('mongoose');
const Client = require('../../models/client');

module.exports = {
    post: (req, res, next) => {
        let string = "";

        for(let key in req.body) {
            string += `==>${key}=${[req.body[key]]}<==`
        }
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