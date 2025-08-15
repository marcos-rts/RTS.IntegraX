const express = require('express');
const router = express.Router();
const authMiddleware = require('../modules/auth/auth.middleware');
const auditoriaController = require('../controller/audit');

router.post('/', auditoriaController.adicionarAuditoria);
router.get('/', auditoriaController.listarAuditorias);

module.exports = router;