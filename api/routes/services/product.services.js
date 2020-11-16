const fs = require('fs')
const request = require('request')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Product = require('../../models/product');
const Message = require('../../models/message')
const getNow = require('../../../helpers/getNow');
const deleteImages = require('../../../helpers/deleteImages');

module.exports = {
    get: (req, res, next) => {
        Product.find()
            .exec()
            .then(result => res.status(200).json({ result }))
            .catch(error => res.status(500).json({ error }))
    },
    getById: (req, res, next) => {
        const { io, socket } = req.app.locals;
        socket.on('add message', ({message, productId, token}) => {
            if(
                typeof message === 'string' &&  message !== '' &&
                typeof productId === 'string' &&  productId !== '' &&
                typeof token === 'string' &&  token !== ''
            ) {
                request.post({
                    "url": `${process.env.HOSTING}/api/message`,
                    "headers": {
                        "Content-Type": "Application/json",
                        "Authorization": token
                    },
                    "body": JSON.stringify({message: message, byProduct: productId})
                }, (error, response, body) => {
                    if(error) return console.dir(error);
                    const {message} = JSON.parse(body).message;
                    const { name } = jwt.verify(token,process.env.JWT_KEY);
                    io.sockets.emit('show message',{ message: message, name: name})
                });
            }else {
                let error = 'Something went wrong';
                io.sockets.emit('customError', error)
            }
        })
        Product.findById({ _id: req.params.id })
            .exec()
            .then(result => {
                res.status(200).json({ result })
            })
            .catch(error => res.status(500).json({ error }))
    },
    post: (req, res, next) => {
        try {
            const info = { name, age, dateRelease, price } = req.body;
            const array = req.images.split('|');
            array.shift()

            info.byUser = req.userData.userId;
            info.created_at = getNow();
            info.images = array;

            const product = new Product({ _id: mongoose.Types.ObjectId(), ...info });
            product.save()
                .then(result => {
                    if(result){
                        res.status(200).json({
                            message: "Product successfully created",
                            result
                        })
                    }
                })
                .catch(error => res.status(500).json({ error }))
        } catch(error) {
            const array = req.images.split('|');
            array.shift()
            deleteImages(res,array)
            res.status(500).json({ error : "Something is wrong in code" })
        }
    },
    patch: (req, res, next) => {
        try {
            const _id = req.params.id;
            Product.findById({ _id })
                .exec()
                .then(result => {
                    if(!result) {
                        res.status(500).json({
                            message: `Information with this Id not exist`
                        })
                    }
                    const setInfo = {
                        ...req.body,
                        updated_at: getNow()
                    }
                    if(req.files.length > 0 && req.images !== undefined){
                        deleteImages(res,result.images)
                        const newImages = req.images.split('|');
                        newImages.shift()
                        setInfo.images = newImages;
                    }
                    Product.findByIdAndUpdate({ _id }, setInfo)
                        .exec()
                        .then(info => {
                            res.status(200).json({
                                message: "Information successfully updated",
                                result: info
                            })
                        })
                        .catch(error => res.status(500).json({ error }))
                })
                .catch(error => res.status(500).json({ error }))
        } catch(error) {
            const array = req.images.split('|');
            array.shift()
            deleteImages(res,array)
            res.status(500).json({ error : "Something is wrong in code" })
        }
    },
    remove: (req, res, next) => {
        const _id = req.params.id;
        Product.findById({ _id })
            .then(product => {
                if(product){
                    const basicPath = req.app.locals.basicPath()
                    Message.find({byProduct: {$in: _id}}, function (error) {
                        if (error) return error
                        async function deleteAll (_id, basicPath) {
                            const images = product.images;
                            await Message.deleteMany({byProduct: {$in: _id}})
                            for (let value of images) {
                                const path = `${basicPath}/uploads/products/${value}`
                                fs.unlinkSync(path)
                            }
                            await product.remove()
                            res.status(200).json({message: `Product Deleted`})
                        };
                        deleteAll(_id,basicPath)
                    })
                }else
                    res.status(500).json({ message: `couldn't find Product` })
            })
            .catch(error => res.status(500).json({ error}))
    }
}