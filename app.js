const express = require('express');
const app = express();
const mongoose = require('mongoose');
const env = require('dotenv').config()
const bodyParser = require('body-parser');


const saveClientData = require('./api/routes/client');
const userRoutes = require('./api/routes/user');
const imageRoutes = require('./api/routes/image');
const messageRoutes = require('./api/routes/message');
const productRoutes = require('./api/routes/product');

mongoose.connect(
    `mongodb+srv://projects:information@idontknow.v9b7v.mongodb.net/IDontKnow?retryWrites=true&w=majority`,

    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

// projects
// information
// Clusters

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-All-Methods, PUT, POST, PATCH, DELETE')
        return res.status(200).json({});
    }
    next()
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads', imageRoutes)
app.use('/api/client', saveClientData)
app.use('/api/user', userRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/product', productRoutes)


app.use((req, res, next) => {
    const error = new Error("404 Not Found");
    error.status = 404;
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

mongoose.connection.once('open', () => { console.log('MongoDB Connected66'); });
mongoose.connection.on('error', (err) => { console.log('MongoDB connection error 55: ', err); });

module.exports = app;
