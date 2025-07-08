const express = require('express');
const router = express.Router();
const { login, register, users, reset_senha_admin } = require('./auth.controller');
const authMiddleware = require('./auth.middleware');

router.post('/login', login);
router.post('/register', register);
router.get('/users', authMiddleware, users);
router.post('/reset_senha_admin', reset_senha_admin);

router.get('/validate_token', authMiddleware, (req, res) => {
    res.json({ message: `Você está autenticado como ${req.usuario.email}` });
});

module.exports = router;