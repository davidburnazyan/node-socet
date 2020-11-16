const express = require('express');
const router = express.Router();
const { get, getByUser, getByProduct, post, remove } = require('./services/message.services');
const checkAuth = require('../Middleware/CheckAuth');
const { validation } = require('../Middleware/Validations');
const { setValidationObject } = require('./validationObjects');

router.get('/', get)
router.get('/:userId', getByUser)
router.get('/product/:productId', getByProduct)
router.post('/', checkAuth, setValidationObject, validation, post)
router.delete('/:id', checkAuth, remove)


module.exports = router;