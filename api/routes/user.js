const express = require('express');
const router = express.Router();
const upload = require('../../helpers/upload');
const { validation } = require('../Middleware/Validations');
const { get_users, delete_user, sign_in, sign_out, sign_up, check_auth } = require('./services/user.services');
const { setValidationObject } = require('./validationObjects');
 
router.get('/', get_users)
router.post('/check-auth', check_auth)
router.post('/sign-in', sign_in)
router.post('/sign-up', upload.single('avatar'),
    setValidationObject,
    validation,
    sign_up)
router.post('/sign-out', sign_out)
router.delete('/:id', delete_user)


module.exports = router;