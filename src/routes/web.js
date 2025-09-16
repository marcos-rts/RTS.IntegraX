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

router.get('/pessoas', (req, res) => {
    res.sendFile(path.join(publicPath, 'users', 'pessoas.html'));
});

// 🎟️ Tickets
router.get('/lista_tickets', (req, res) => {
    res.sendFile(path.join(publicPath, 'tickets', 'lista_tickets.html'));
});
router.get('/novo_tickets', (req, res) => {
    res.sendFile(path.join(publicPath, 'tickets', 'novo_tickets.html'));
});

router.get('/ticket_detalhes/:id', (req, res) => {
  res.sendFile(path.join(publicPath, 'tickets', 'ticket_detalhes.html'));
});

router.get('/ticket_detalhes/:id', (req, res) => {
  res.sendFile(path.join(publicPath, 'tickets', 'ticket_detalhes.html'));
});

router.get('/ticket_editar/:id', (req, res) => {
  res.sendFile(path.join(publicPath, 'tickets', 'ticket_editar.html'));
});

// 💵 Finanx
router.get('/finanxIndex', (req, res) => {
    res.sendFile(path.join(publicPath, 'finanx', 'painel.html'));
});

module.exports = router;