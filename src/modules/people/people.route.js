const express = require('express');
const router = express.Router();
const { pessoa } = require('./people.controller');
const authMiddleware = require('../auth/auth.middleware');

router.get('/', authMiddleware, pessoa);

module.exports = router;