// src/modules/githubSync.js
require('dotenv').config();
const axios = require('axios');
const db = require('../../config/database');

// Token do GitHub
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
    throw new Error("❌ GITHUB_TOKEN não definido no arquivo .env");
}

const HEADERS = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
};

/**
 * Extrai owner e repositório de uma URL do GitHub.
 */
function extrairOwnerERepo(repoUrl) {
    const regex = /github\.com\/([\w-]+)\/([\w.-]+)(?:\.git)?$/i;
    const match = repoUrl?.match?.(regex);
    if (!match) {
        console.warn(`⚠️ URL inválida: "${repoUrl}"`);
        return null;
    }

    const [, owner, repo] = match;
    return { owner, repo };
}

/**
 * Busca todas as issues de um repositório no GitHub.
 */
async function buscarIssuesPorRepositorio(repoUrl) {
    const identificadores = extrairOwnerERepo(repoUrl);
    if (!identificadores) return [];

    const { owner, repo } = identificadores;
    let page = 1;
    const issues = [];

    try {
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
    } catch (error) {
        console.error(`❌ Erro ao buscar issues de ${owner}/${repo}:`, error.response?.data || error.message);
    }

    return issues;
}

/**
 * Sincroniza issues do GitHub com o banco de dados local.
 */
async function sincronizarIssues() {
    try {
        const [grupoProjeto] = await db.execute(
            "SELECT id FROM RTS_grupo WHERE nome = 'Projeto' AND excluido = 0 LIMIT 1"
        );

        if (!grupoProjeto.length) {
            console.warn("⚠️ Grupo 'Projeto' não encontrado.");
            return;
        }

        const grupoId = grupoProjeto[0].id;

        const [tickets] = await db.execute(
            `SELECT id, title, url_github 
             FROM TK_tickets 
             WHERE grupo_id = ? AND url_github IS NOT NULL AND excluido = 0`,
            [grupoId]
        );

        for (const ticket of tickets) {
            const issues = await buscarIssuesPorRepositorio(ticket.url_github);

            for (const issue of issues) {
                await db.execute(
                    `INSERT INTO GH_integracao (ticket_id, tipo, github_id, titulo, url, status)
                     VALUES (?, 'issue', ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE 
                        titulo = VALUES(titulo),
                        status = VALUES(status)`,
                    [ticket.id, issue.id, issue.title, issue.html_url, issue.state]
                );
            }
        }

        // Atualiza tabela de execução do cron
        const agora = new Date();
        const proxima = new Date(agora.getTime() + 60000); // 1 minuto depois

        await db.execute(
            `INSERT INTO CRON_coleta (ultima_execucao, proxima_execucao)
             VALUES (?, ?)`,
            [agora, proxima]
        );

        console.log(`✅ Sincronização concluída com sucesso em ${agora.toLocaleString()}`);

    } catch (error) {
        console.error("❌ Erro na sincronização:", error.message || error);
    }
}

module.exports = sincronizarIssues;
