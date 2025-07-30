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
 * Busca todas as issues e PRs de um repositório.
 */
async function buscarIssuesEPRs(repoUrl) {
    const identificadores = extrairOwnerERepo(repoUrl);
    if (!identificadores) return [];

    const { owner, repo } = identificadores;
    let page = 1;
    const resultados = [];

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

            // Classifica entre issue e PR
            for (const item of res.data) {
                const tipo = item.pull_request ? 'pull_request' : 'issue';
                resultados.push({
                    tipo,
                    github_id: item.id,
                    titulo: item.title,
                    url: item.html_url,
                    status: item.state
                });
            }

            page++;
        }
    } catch (error) {
        console.error(`❌ Erro ao buscar dados de ${owner}/${repo}:`, error.response?.data || error.message);
    }

    return resultados;
}

/**
 * Sincroniza issues e PRs do GitHub com o banco de dados local.
 */
async function sincronizarIssuesEPRs() {
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
            const dados = await buscarIssuesEPRs(ticket.url_github);

            for (const entrada of dados) {
                await db.execute(
                    `INSERT INTO GH_integracao (ticket_id, tipo, github_id, titulo, url, status)
                     VALUES (?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE 
                        titulo = VALUES(titulo),
                        status = VALUES(status)`,
                    [
                        ticket.id,
                        entrada.tipo,
                        entrada.github_id,
                        entrada.titulo,
                        entrada.url,
                        entrada.status
                    ]
                );
            }
        }

        // Atualiza a tabela de execução do cron
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

module.exports = sincronizarIssuesEPRs;
