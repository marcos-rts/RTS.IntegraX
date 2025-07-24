const express = require('express');
const path = require('path');
const router = express.Router();

// Paginas públicas (HTML)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

router.get('/painel', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'painel.html'));
});

router.get('/esqueci-senha', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'esqueci-senha.html'));
});

router.get('/controle_usuarios', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'usuarios.html'));
});

router.get('/cadastrar_usuario', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'cria_usuario.html'));
});

router.get('/lista_tickets', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'lista_tickets.html'));
});

module.exports = router;