const express = require('express');
const router = express.Router();
const fxTransacao = require('../controller/transacao.controller');
const authMiddleware = require('./../../../../auth/auth.middleware')

router.use(authMiddleware);


router.post("/transacoes", fxTransacao.createTransacao);
router.get("/transacoes", fxTransacao.getAllTransacoes);
router.get("/transacoes/:id", fxTransacao.getTransacaoById);
router.put("/transacoes/:id", fxTransacao.updateTransacao);
router.delete("/transacoes/:id", fxTransacao.deleteTransacao);


module.exports = router;