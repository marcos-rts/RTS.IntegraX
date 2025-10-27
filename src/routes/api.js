const express = require('express');
const router = express.Router();

const Logger = require('../modules/utils/Console_Logger');
const FileLogger = require('../modules/utils/FileLogger');
const authMiddleware = require('../modules/auth/auth.middleware');

const fileLogger = new FileLogger('logs/app.log', 'logs/app.json');
const logger = new Logger();

// ✅ CORRIGIDO: Rota principal da API (agora fica em /api)
router.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'API funcionando corretamente',
        data: {
            service: 'Nome da Sua API',
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            endpoints: {
                authentication: '/api/autenticacao',
                status: '/api/status',
                groups: '/api/grupo',
                people: '/api/people',
                audit: '/api/auditoria',
                tickets: '/api/tickets'
            }
        }
    });
});

// ⚙️ Autenticação
const rotasAutenticacao = require('../modules/auth/auth.route');
router.use('/autenticacao', rotasAutenticacao);

// ⚙️ Grupo e Status
const { status, grupo } = require('../controller/rts.grupo_status');
router.get('/status', authMiddleware, status);
router.get('/grupo', authMiddleware, grupo);

// ⚙️ Pessoas
const rotasPessoas = require('../modules/people/people.route');
router.use('/people', rotasPessoas);

// Auditoria 
const rotasAuditoria = require('./audit');
router.use('/auditoria', rotasAuditoria);

// Estatísticas 
const rotasEstatisticas = require('./estatistica');
router.use('/estatistica', rotasEstatisticas);

// ⚙️ Módulo Tickets
try {
    const setupTicketsModule = require('../modules/services/controle_tickets/tickets.module');
    setupTicketsModule(router); // importante: o módulo precisa aceitar o `router`
    logger.System('Módulo de Tickets carregado com sucesso.');
} catch (error) {
    logger.Error('Módulo de Tickets não pôde ser carregado:', error.message);
}

// ⚙️ Finanx
try {
    const setupFinanxModule = require('../modules/services/Finanx/finanx.module');
    setupFinanxModule(router); // importante: o módulo precisa aceitar o `router`
    logger.System('Módulo de Finanx carregado com sucesso.');
} catch (error) {
    logger.Error('Módulo de Finanx não pôde ser carregado:', error.message);
}


// ⚙️ (Outros módulos podem ir aqui também)

module.exports = router;