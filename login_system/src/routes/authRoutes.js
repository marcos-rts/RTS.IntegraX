const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const { privateRouter } = require('../controllers/privateController');
const authenticate = require('../middlewares/authMiddleware');

// Rotas publicas
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Rota privada
router.get('/private', authenticate, privateRouter);

module.exports = router;