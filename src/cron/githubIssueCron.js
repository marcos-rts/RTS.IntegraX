// src/cron/githubIssueCron.js
const cron = require('node-cron');
const sincronizarIssuesEPRs = require('../modules/GitHub/githubSync');
const Logger = require('./../modules/utils/Console_Logger');

const logger = new Logger();

cron.schedule('* * * * *', async () => {
  logger.Info(`Rodando sincronização do GitHub...`);
  try {
    await sincronizarIssuesEPRs();
    // logger.Success('✅ Sincronização concluída.');
  } catch (err) {
    logger.Error('❌ Erro na sincronização:', err.message);
  }
});
