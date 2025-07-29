const db = require('../../src/config/database');
const { getIssues } = require('./github');
require('dotenv').config();

async function syncIssues() {
  try {
    const issues = await getIssues();

    for (const issue of issues) {
      const [rows] = await db.execute(
        'SELECT id FROM GH_integracao WHERE github_id = ? AND tipo = "issue"',
        [issue.id]
      );

      if (rows.length === 0) {
        // Insere nova issue
        await db.execute(
          `INSERT INTO GH_integracao 
           (ticket_id, tipo, github_id, titulo, url, status, criado_em, atualizado_em)
           VALUES (?, 'issue', ?, ?, ?, ?, NOW(), NOW())`,
          [null, issue.id, issue.title, issue.html_url, issue.state]
        );
        console.log(`Inserida issue: #${issue.number}`);
      } else {
        // Atualiza status e título
        await db.execute(
          `UPDATE GH_integracao SET titulo = ?, status = ?, atualizado_em = NOW()
           WHERE github_id = ? AND tipo = 'issue'`,
          [issue.title, issue.state, issue.id]
        );
        console.log(`Atualizada issue: #${issue.number}`);
      }
    }

  } catch (err) {
    console.error('Erro na sincronização:', err.message);
  } finally {
    // db.end();
  }
}

syncIssues();
