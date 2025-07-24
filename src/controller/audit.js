const Logger = require('../utils/Console_Logger');
const logger = new Logger();
const FileLogger = require('../utils/FileLogger');
const db = require('../config/database'); // ajuste o caminho conforme necessário
const fileLogger = new FileLogger('../../logs/audit.log', '../../logs/audit.json');

async function adicionarAuditoria({
    tabela,
    id_registro,
    acao,
    antes,
    depois,
    feito_por_id
}) {
    try {
        const sql = `
            INSERT INTO RTS_auditoria 
                (tabela, id_registro, acao, antes, depois, feito_por_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [
            tabela,
            id_registro,
            acao,
            JSON.stringify(antes),
            JSON.stringify(depois),
            feito_por_id
        ];
        await db.query(sql, params);
        logger.info(`Auditoria registrada: ${acao} em ${tabela} (ID: ${id_registro}) por usuário ${feito_por_id}`);
        fileLogger.log({
            tabela,
            id_registro,
            acao,
            antes,
            depois,
            feito_por_id,
            feito_em: new Date()
        });
    } catch (error) {
        logger.error('Erro ao registrar auditoria:', error);
        fileLogger.log({ error: error.message, tabela, id_registro, acao });
    }
}

module.exports = {
    adicionarAuditoria
};