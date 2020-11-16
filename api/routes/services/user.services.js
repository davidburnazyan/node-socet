const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/user');
const Product = require('../../models/product')
const Message = require('../../models/message')

module.exports = {
    /**
     *
     *  if worked checkAuth middleware in req was added userData
     *
     *      Important
     *
     *      In user controller middleware checking signIn and signUp, if middleware return success need return false
     * */
    check_auth: (req, res, next) => {
        try {
            const result = jwt.verify(req.headers.authorization, process.env.JWT_KEY)
            if(typeof result === 'object') {
                res.status(200).json({
                    message: "Auth Success",
                    payload: {
                        token: req.headers.authorization
                    }
                })
            }
        }catch {
            res.status(500).json({
                message: 'Auth failed',
                token: null
            })
        }
    },
    get_users: (req, res, next) => {
        User.find()
            .exec()
            .then(result => res.status(200).json({ result }))
            .catch(error => res.status(500).json({ error }))
    },
    sign_in: (req, res, next) => {
        const { email } = req.body
        User.find({ email })
            .exec()
            .then(user => {
                if(user.length < 1) {
                    return res.status(500).json({
                        message: 'Auth failed'
                    })
                }else {
                    bcrypt.compare(req.body.password,user[0].password)
                        .then(result => {
                            if(result){
                                const token = jwt.sign(
                                    {
                                        name: user[0].name,
                                        surname: user[0].surname,
                                        email: user[0].email,
                                        userId: user[0]._id,
                                        avatar: user[0].avatar,
                                    },
                                    process.env.JWT_KEY,
                                    {
                                        expiresIn: "12h"
                                    }
                                )
                                User.update({_id: user[0]._id},{ token })
                                    .then(doc => {
                                        res.status(200).json({
                                            message: "Auth Successful",
                                            token: token
                                        })
                                    }).catch(error => {
                                    res.status(500).json({error})
                                })
                            }else {
                                res.status(500).json({
                                    message: "Incorrect email or password"
                                })
                            }
                        })
                        .catch(error => {
                            res.status(500).json({ error})
                        })
                }
            })
            .catch(error => {
                res.status(500).json({ error })
            })
    },
    sign_up: (req, res, next) => {
        try {
            const { name, surname, email, password } = req.body;
            User.find({ email })
                .exec()
                .then(user => {
                    if(user.length >= 1){
                        res.status(409).json({
                            message: "Mail exists"
                        })
                    }
                })
                .catch(error => res.status(500).json({ error }))

            bcrypt.hash(password,10, (error, hash) => {
                if(error) {
                    return res.status(500).json({ error })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name, surname, email,
                        password: hash,
                        avatar: req.file === undefined ? 'default-user.png' : req.file.filename
                    })
                    user.save()
                        .then(result => {
                            res.status(201).json({
                                message: "User successfully created",
                                result: result
                            })
                        })
                        .catch(error => res.status(500).json({ error }))
                }
            })
        } catch(error) {
            const path = __dirname + `../../../uploads/users/${req.file.filename}`;
            fs.unlink(path, (err) => {
                if (err) { res.status(500).json({ message: "couldn't find file" }) }
            })
            res.status(500).json({ error : "Something is wrong in code" })
        }
    },
    sign_out: (req, res, next) => {
        try {
            const token = req.headers.authorization;
            const user = jwt.verify(token,process.env.JWT_KEY);

            User.update({ _id: user.userId },{
                token: false
            }).then(result => {
                res.status(200).json({
                    message: 'Sign out Done',
                    token: false
                })
            })
        } catch {
            return res.status(500).json({
                message: "Try sign out again"
            })
        }
    },
    delete_user: (req, res, next) => {
        const _id = req.params.id
        const basicPath = req.app.locals.basicPath()
        User.findById({ _id })
            .then(user => {
                if(user){
                    Product.find({ byUser: user._id }, function(err, products) {
                        if (err) return err
                        const productsIds = products.map(elem => elem._id)
                        let images = products.map(elem => elem.images.map(el => el))
                        const imageArray = [];
                        for (let i = 0; i < images.length; i++) imageArray.push(...images[i])
                        Message.find({byProduct: {$in: productsIds}}, function (error, messages) {
                            if (err) return error
                            async function deleteAll (productsIds, basicPath) {
                                await Message.deleteMany({byProduct: {$in: productsIds}})
                                await Product.deleteMany({_id: {$in: productsIds}})
                                for (let value of imageArray) {
                                    const path = `${basicPath}/uploads/products/${value}`
                                    fs.unlinkSync(path)
                                }
                                if (user.avatar !== "default-user.png"){
                                    fs.unlinkSync(`${basicPath}/uploads/users/${user.avatar}`)
                                }
                                await user.remove()
                                res.status(200).json({message: `User Deleted`})
                            };
                            deleteAll(productsIds, basicPath)
                        })
                    })
                }else
                    res.status(500).json({ message: `couldn't find User` })
            })
            .catch(error => {
                res.status(500).json({ error})
            })
    },
}