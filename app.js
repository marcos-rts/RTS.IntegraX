const express = require('express');
const Logger = require('./src/modules/utils/Console_Logger');
const connection = require('./src/config/database');
require('dotenv').config();

const logger = new Logger();
const app = express();

// ⬇️ Adiciona esses dois middlewares aqui!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas de autenticação
const rotasAutenticacao = require('./src/modules/auth/auth.route');
app.use('/api/autenticacao', rotasAutenticacao);

// Start do servidor
app.listen(process.env.PORT, () => {
  logger.System(`Servidor rodando na porta: ${process.env.PORT}`);
  
  try {
    const setupItensModule = require('./src/modules/services/controle_de_itens/itens.module');
    setupItensModule(app);
    logger.System('Módulo de Itens carregado com sucesso.');
  } catch (error) {
    logger.Error('Módulo de Itens não pôde ser carregado:', error.message);
  }
});
