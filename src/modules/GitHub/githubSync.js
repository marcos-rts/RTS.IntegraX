// src/modules/githubSync.js
const axios = require('axios');
const db = require('../../config/database');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const HEADERS = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
};

async function buscarIssuesPorRepositorio(repoUrl) {
    const regex = /github\.com\/(.+?)\/(.+?)(?:\.git)?$/;
    const match = repoUrl.match(regex);
    if (!match) return [];

    const [_, owner, repo] = match;
    let page = 1;
    const issues = [];

    while (true) {
        const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`, {
            headers: HEADERS,
            params: {
                per_page: 100,
                page,
                state: 'all'
            }
        });
        if (res.data.length === 0) break;
        issues.push(...res.data);
        page++;
    }
    return issues;
}

async function sincronizarIssues() {
    const [grupoProjeto] = await db.execute("SELECT id FROM RTS_grupo WHERE nome = 'Projeto' AND excluido = 0 LIMIT 1");
    if (!grupoProjeto.length) return;

    const tickets = await db.execute(
        "SELECT id, title, url_github FROM TK_tickets WHERE grupo_id = ? AND url_github IS NOT NULL AND excluido = 0",
        [grupoProjeto[0].id]
    );

    for (const ticket of tickets) {
        const issues = await buscarIssuesPorRepositorio(ticket.url_github);

        for (const issue of issues) {
            await db.execute(
                `INSERT INTO GH_integracao (ticket_id, tipo, github_id, titulo, url, status)
         VALUES (?, 'issue', ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), status = VALUES(status)`,
                [ticket.id, issue.id, issue.title, issue.html_url, issue.state]
            );
        }
    }

    const agora = new Date();
    const proxima = new Date(agora.getTime() + 60000); // +1 min
    await db.execute(
        `INSERT INTO CRON_coleta (ultima_execucao, proxima_execucao)
     VALUES (?, ?)`,
        [agora, proxima]
    );
}

module.exports = sincronizarIssues;
