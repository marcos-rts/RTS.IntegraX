const express = require('express');
const path = require('path'); // Não esquece esse também, tá usando path sem importar
const dotenv = require('dotenv');
const Logger = require('./src/modules/utils/Console_Logger');
const FileLogger = require('./src/modules/utils/FileLogger');
require('./src/cron/githubIssueCron'); // Importa o cron para iniciar a sincronização

dotenv.config();

const fileLogger = new FileLogger('logs/app.log', 'logs/app.json');
const logger = new Logger();
const app = express();

// ⬇️ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⬇️ Rotas externas
const apiRoutes = require('./src/routes/api')
const webRoutes = require('./src/routes/web');

app.use('/api', apiRoutes);
app.use('/', webRoutes);

// Serve arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));


// 🔥 Inicializar o servidor
app.listen(process.env.PORT, () => {
  // logger.System(`Servidor rodando na porta: ${process.env.PORT}`);
  logger.System(`🚀 Servidor rodando em: http://localhost:${process.env.PORT}`);
  logger.Info(`📁 Diretório: ${__dirname}`);
  logger.Info(`🌐 Frontend: http://localhost:${process.env.PORT}`);
  logger.Info(`🔌 API: http://localhost:${process.env.PORT}/api`);
  // logger.Info(`📊 Teste banco: http://localhost:${process.env.PORT}/db-test`);
  // logger.Info(`💚 Health check: http://localhost:${process.env.PORT}/health`);
  fileLogger.log(`Servidor rodando na porta: ${process.env.PORT}`);
})