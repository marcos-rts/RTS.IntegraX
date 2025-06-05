const express = require('express');
const Logger = require('./src/modules/utils/Console_Logger');
const logger = new Logger();
const connection = require('./src/config/database');
const app = express();
require('dotenv').config();

// const name = require('./src/routes');
// app.use('/api', name);

app.listen(process.env.PORT, () => {
  logger.System(`Servidor rodando na porta: ${process.env.PORT}`);
});
