const express = require('express');
const router = express.Router();
const { productImage, userAvatar, defaultImage } = require('./services/image.services');

router.get('/products/:productImage', productImage)
router.get('/users/:userAvatar', userAvatar)
router.get('/default/:image', defaultImage)

module.exports = router;