const express = require('express');
const router = express.Router();
const { post } = require('./services/client.services');

router.post('/', post)

module.exports = router;