const express = require('express');
const router = express.Router();
const { pessoa, createPessoa } = require('./people.controller');
const authMiddleware = require('../auth/auth.middleware');

router.get('/', authMiddleware, pessoa);
router.post('/createPessoa', authMiddleware, createPessoa);
module.exports = router;