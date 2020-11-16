const mongoose = require('mongoose');
const Message = require('../../models/message');
const getNow  = require('../../../helpers/getNow');

module.exports = {
    get: (req, res, next) => {
        Message.find()
            .exec()
            .then(result => res.status(200).json({ result }))
            .catch(error => res.status(500).json({ error }))
    },
    getByProduct: (req, res, next) => {
        const { productId } = req.params;
        Message.count({byProduct: productId})
            .then((count) => {
                Message.find({byProduct: productId})
                    .skip(count < 8 ? 0 : count - 8)
                    .limit(8)
                    .populate('byUser')
                    .populate('byProduct')
                    .then(result => {
                        res.status(200).json({
                            result
                        })
                    })
                    .catch(error => res.status(500).json({ error }))
            })
            .catch(error => {
                console.log(222)
                res.status(500).json({ error })
            })
    },
    getByUser: (req, res, next) => {
        Message.findById({ _id: req.params.userId } )
            .populate('byUser')
            .then(result => {
                res.status(200).json({
                    result
                })
            })
            .catch(error => res.status(500).json({ error }))
    },
    post: (req, res, next) => {
        if(req.userData.userId){
                const { message, byProduct } = req.body;
                const newMessage = new Message({
                    _id: mongoose.Types.ObjectId(),
                    byUser: req.userData.userId,
                    byProduct, message,
                    created_at: getNow()
                })
                newMessage.save()
                    .then(msg => {
                        if(Object.entries(msg).length > 4){
                            res.status(200).json({
                                message: msg
                            })
                        }else {
                            res.status(500).json({
                                error: "Something is wrong"
                            })
                        }

                    })
                    .catch(error => {
                        res.status(500).json({ error })
                    })
        }else {
            res.status(500).json({ message: "Please try authorization again" })
        }

    },
    remove: (req, res, next) => {
        const _id = req.params.id;
        Message.findByIdAndRemove({ _id })
            .then(result => {
                res.status(200).json({
                    message: 'Message is successfully deleted',
                    result,
                })
            })
            .catch(error => res.status(500).json({ error }))
    }
}