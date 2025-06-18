const express = require('express');
const router = express.Router();
const { login, register, users } = require('./auth.controller');
const authMiddleware = require('./auth.middleware');

router.post('/login', login);
router.post('/register', register);
router.get('/users', authMiddleware, users);

router.get('/validate_token', authMiddleware, (req, res) => {
    res.json({ message: `Você está autenticado como ${req.usuario.email}` });
});

module.exports = router;