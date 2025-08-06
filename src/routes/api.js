const express = require('express');
const router = express.Router();

const Logger = require('../modules/utils/Console_Logger');
const FileLogger = require('../modules/utils/FileLogger');
const authMiddleware = require('../modules/auth/auth.middleware');

const fileLogger = new FileLogger('logs/app.log', 'logs/app.json');
const logger = new Logger();

// ⚙️ Autenticação
const rotasAutenticacao = require('../modules/auth/auth.route');
router.use('/autenticacao', rotasAutenticacao);

// ⚙️ Grupo e Status
const {status, grupo} = require('../controller/rts.grupo_status');
router.get('/status', authMiddleware, status);
router.get('/grupo', authMiddleware, grupo);

// ⚙️ Pessoas
const rotasPessoas = require('../modules/people/people.route');
router.use('/people', rotasPessoas);

// ⚙️ Módulo Tickets
try {
    const setupTicketsModule = require('../modules/services/controle_tickets/tickets.module');
    setupTicketsModule(router); // importante: o módulo precisa aceitar o `router`
    logger.System('Módulo de Tickets carregado com sucesso.');
} catch (error) {
    logger.Error('Módulo de Tickets não pôde ser carregado:', error.message);
}

// ⚙️ (Outros módulos podem ir aqui também)

module.exports = router;
