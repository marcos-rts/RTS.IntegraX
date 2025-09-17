const express = require('express');
const router = express.Router();
const fxTransacao = require('../controller/transacao.controller');
const fxCarteira = require('../controller/carteira.controller');
const authMiddleware = require('./../../../../auth/auth.middleware')

router.use(authMiddleware);

// Transações
router.post("/transacoes", fxTransacao.createTransacao);
router.get("/transacoes", fxTransacao.getAllTransacoes);
router.get("/transacoes/:id", fxTransacao.getTransacaoById);
router.put("/transacoes/:id", fxTransacao.updateTransacao);
router.delete("/transacoes/:id", fxTransacao.deleteTransacao);

// Carteiras
router.get('/carteiras', fxCarteira.listarCarteiras); // Listagem
router.post('/carteiras', fxCarteira.criarCarteira); // Criar carteira
module.exports = router;