const express = require('express');
const router = express.Router();
const EstatisticaController = require('../controller/estatistica');
const authMiddleware = require('../modules/auth/auth.middleware');

router.get('/', EstatisticaController.getEstatisticasGerais);

module.exports = router;
