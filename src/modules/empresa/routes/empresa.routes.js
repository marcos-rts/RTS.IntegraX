const express = require('express');
const router = express.Router();
const { empresa, createEmpresa, updateEmpresa, deleteEmpresa } = require('../controller/empresa.controller');
const authMiddleware = require('../../auth/auth.middleware');

// Rotas
router.get('/', authMiddleware, empresa);
router.post('/createEmpresa', authMiddleware, createEmpresa);
router.put('/update/:id', authMiddleware, updateEmpresa);
router.delete('/delete/:id', authMiddleware, deleteEmpresa);

module.exports = router;
