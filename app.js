const express = require('express');
const path = require('path'); // Não esquece esse também, tá usando path sem importar
const Logger = require('./src/modules/utils/Console_Logger');
const FileLogger = require('./src/modules/utils/FileLogger');
require('dotenv').config();

const fileLogger = new FileLogger('logs/app.log', 'logs/app.json');
const logger = new Logger();
const app = express();

// ⬇️ Adiciona esses dois middlewares aqui!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas de autenticação
const rotasAutenticacao = require('./src/modules/auth/auth.route');
app.use('/api/autenticacao', rotasAutenticacao);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/painel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'painel.html'));
});

app.get('/esqueci-senha', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'esqueci-senha.html'));
});

// Start do servidor
app.listen(process.env.PORT, () => {
  logger.System(`Servidor rodando na porta: ${process.env.PORT}`);
  fileLogger.system(`Servidor rodando na porta: ${process.env.PORT}`);
  
  // try {
  //   const setupItensModule = require('./src/modules/services/controle_de_itens/itens.module');
  //   setupItensModule(app);
  //   logger.System('Módulo de Itens carregado com sucesso.');
  // } catch (error) {
  //   logger.Error('Módulo de Itens não pôde ser carregado:', error.message);
  // }

    try {
    const setupTicketsModule = require('./src/modules/services/controle_tickets/tickets.module');
    setupTicketsModule(app);
    logger.System('Módulo de Tickets carregado com sucesso.');
  } catch (error) {
    logger.Error('Módulo de Tickets não pôde ser carregado:', error.message);
  }
});
