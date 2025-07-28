const express = require('express');
const path = require('path');
const router = express.Router();

const publicPath = path.join(__dirname, '../../public');

// 🏠 Página principal
router.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

router.get('/painel', (req, res) => {
    res.sendFile(path.join(publicPath, 'painel.html'));
});

// 🔑 Autenticação
router.get('/esqueci-senha', (req, res) => {
    res.sendFile(path.join(publicPath, 'auth', 'esqueci-senha.html'));
});

// 🧑‍💻 Usuários
router.get('/controle_usuarios', (req, res) => {
    res.sendFile(path.join(publicPath, 'users', 'usuarios.html'));
});

router.get('/cadastrar_usuario', (req, res) => {
    res.sendFile(path.join(publicPath, 'users', 'cria_usuario.html'));
});

// 🎟️ Tickets
router.get('/lista_tickets', (req, res) => {
    res.sendFile(path.join(publicPath, 'tickets', 'lista_tickets.html'));
});
router.get('/novo_tickets', (req, res) => {
    res.sendFile(path.join(publicPath, 'tickets', 'novo_tickets.html'));
})

module.exports = router;