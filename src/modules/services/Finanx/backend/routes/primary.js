const express = require('express');
const router = express.Router();
const finanxController = require('../controller/primary');
const authMiddleware = require('./../../../../auth/auth.middleware')

router.use(authMiddleware);


router.post("/transacoes", finanxController.createTransacao);
router.get("/transacoes", finanxController.getAllTransacoes);
router.get("/transacoes/:id", finanxController.getTransacaoById);
router.put("/transacoes/:id", finanxController.updateTransacao);
router.delete("/transacoes/:id", finanxController.deleteTransacao);


module.exports = router;