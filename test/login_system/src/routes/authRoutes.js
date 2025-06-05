const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');
const {authenticateToken} = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Exemplo de rota protegida
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: `Perfil do usuário ${req.user.email}` });
});

module.exports = router;
