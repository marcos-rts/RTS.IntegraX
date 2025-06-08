const express = require('express');
const router = express.Router();
const { login, register, users } = require('./auth.controller');

router.post('/login', login);
router.post('/register', register);
router.get('/users', users);

module.exports = router;