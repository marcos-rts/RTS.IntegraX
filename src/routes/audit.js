const express = require('express');
const router = express.Router();
const {adicionarAuditoria} = require('../controller/audit');
const authMiddleware = require('../modules/auth/auth.middleware');

router.post('/auditoria', authMiddleware, adicionarAuditoria);

module.exports = router;