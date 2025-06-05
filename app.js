const express = require('express');
const Logger = require('./src/modules/utils/Console_Logger');
const connection = require('./src/config/database');

const logger = new Logger();
const app = express();
require('dotenv').config();

const rotasAutenticacao = require('./src/modules/auth/auth.route');
app.use('/api/autenticacao', rotasAutenticacao);

app.listen(process.env.PORT, () => {
  logger.System(`Servidor rodando na porta: ${process.env.PORT}`);
});
