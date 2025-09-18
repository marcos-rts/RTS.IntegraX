const express = require('express');
const router = express.Router();
const fxTransacao = require('../controller/transacao.controller');
const fxCarteira = require('../controller/carteira.controller');
const fxConta = require('../controller/conta.controller');
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

// Contas
router.get('/contas', fxConta.listarContas); // Listagem
router.post('/contas', fxConta.criarConta); // Criar conta
router.put('/contas/:id', fxConta.atualizarConta); // Atualizar conta
router.delete('/contas/:id', fxConta.excluirConta); // Excluir conta

module.exports = router;