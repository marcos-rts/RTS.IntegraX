// src/cron/githubIssueCron.js
const cron = require('node-cron');
const db = require('../config/database')
const sincronizarIssuesEPRs = require('../modules/GitHub/githubSync');
const Logger = require('./../modules/utils/Console_Logger');

const logger = new Logger();

async function executarComRegistro() {
  logger.Trace(`[githubIssueCron.js] - Iniciando sincronização do GitHub...`);
  logger.Info(`Rodando sincronização do GitHub...`);
  try {
    await sincronizarIssuesEPRs();

    // Atualiza a tabela CRON_coleta
    const agora = new Date();
    const proxima = new Date(agora.getTime() + 60000);

    await db.execute(
      `INSERT INTO CRON_coleta (ultima_execucao, proxima_execucao)
       VALUES (?, ?)`,
      [agora, proxima]
    );

    // logger.Success(`✅ Sincronização registrada`);
    logger.Info(`📅 Próxima execução em ${proxima.toLocaleString()}`);
  } catch (err) {
    logger.Error(' Erro na sincronização:', err.message || err);
  }
}

// agenda para rodar a cada minuto
cron.schedule('* * * * *', executarComRegistro);