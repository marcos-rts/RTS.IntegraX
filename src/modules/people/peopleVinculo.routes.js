// controller/people/peopleVinculo.routes.js
const express = require('express');
const router = express.Router();
const {
  listarVinculos,
  criarVinculo,
  atualizarVinculo,
  excluirVinculo,
} = require('./peopleVinculo.controller');
const authMiddleware = require('../auth/auth.middleware');

// 🔹 Rotas principais
router.get('/', authMiddleware, listarVinculos);
router.post('/create', authMiddleware, criarVinculo);
router.put('/update/:id', authMiddleware, atualizarVinculo);
router.delete('/delete/:id', authMiddleware, excluirVinculo);

module.exports = router;
