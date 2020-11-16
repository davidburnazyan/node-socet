const express = require('express');
const router = express.Router();
const upload = require('../../helpers/upload');
const checkAuth = require('../Middleware/CheckAuth');
const { validation } = require('../Middleware/Validations');
const { setValidationObject } = require('./validationObjects');
const { get, getById, post, patch, remove } = require('./services/product.services');

router.get('/', get)
router.get('/:id', getById)
router.post('/',
    checkAuth,
    upload.array('images',5),
    setValidationObject,
    validation,
    post)
router.patch('/:id',
    checkAuth,
    upload.array('images',5),
    setValidationObject,
    validation,
    patch)
router.delete('/:id', checkAuth, remove)

module.exports = router;
