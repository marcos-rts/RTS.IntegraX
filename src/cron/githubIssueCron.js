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
    logger.Debug(`[githubIssueCron.js]
      Sincronização registrada na tabela CRON_coleta
      {
        agora: ${agora},
        proxima: ${proxima}
      }`
    );

    // logger.Success(`✅ Sincronização registrada`);
    logger.Info(`📅 Próxima execução em ${proxima.toLocaleString()}`);
    logger.Trace(`[githubIssueCron.js] - Finalizando sincronização do GitHub...`);
  } catch (err) {
    logger.Error(' Erro na sincronização:', err.message || err);
    logger.Trace(`[githubIssueCron.js] - Finalizando sincronização do GitHub...`);
  }
}

// agenda para rodar a cada minuto
cron.schedule('0 * * * *', executarComRegistro);