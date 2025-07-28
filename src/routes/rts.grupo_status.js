const express = require('express');
const router = express.Router();
const { status } = require('../controller/rts.grupo_status');
const authMiddleware = require('../modules/auth/auth.middleware');

router.get('/status', authMiddleware, status);

module.exports = router;