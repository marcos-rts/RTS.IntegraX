// src/cron/githubIssueCron.js
const cron = require('node-cron');
const sincronizarIssues = require('../modules/GitHub/githubSync');

cron.schedule('* * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Rodando sincronização do GitHub...`);
  try {
    await sincronizarIssues();
    console.log('✅ Sincronização concluída.');
  } catch (err) {
    console.error('❌ Erro na sincronização:', err.message);
  }
});
