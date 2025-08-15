const db = require('../config/database'); // ajuste o caminho conforme necessário

const Logger = require('../modules/utils/Console_Logger');
const FileLogger = require('../modules/utils/FileLogger');

const logger = new Logger();
const fileLogger = new FileLogger('../../logs/app.log', '../../logs/app.json');

exports.adicionarAuditoria = async (req, res) => {
    try {
        const { tabela, id_registro, acao, antes, depois, feito_por_id } = req.body;
        if (!tabela || !id_registro || !acao || !feito_por_id) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        const sql = `INSERT INTO RTS_Auditoria (tabela, id_registro, acao, antes, depois, feito_por_id) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.execute(sql, [tabela, id_registro, acao, antes || null, depois || null, feito_por_id]);

        res.status(201).json({ message: 'Auditoria registrada com sucesso' });
    } catch (error) {
        logger.error('Erro ao registrar auditoria:', error);
        fileLogger.log({ error: error.message, tabela, id_registro, acao });
        res.status(500).json({ error: 'Erro ao registrar auditoria' });
    }
}

// Listar auditorias (com filtros opcionais)
exports.listarAuditorias = async (req, res) => {
    try {
        const { tabela, id_registro, acao, feito_por_id, limit, offset } = req.query;

        let sql = `
      SELECT a.*, u.usuario AS feito_por
      FROM RTS_auditoria a
      LEFT JOIN RTS_usuario u ON u.id = a.feito_por_id
      WHERE 1=1
    `;
        const params = [];

        if (tabela) {
            sql += ` AND a.tabela = ?`;
            params.push(tabela);
        }
        if (id_registro) {
            sql += ` AND a.id_registro = ?`;
            params.push(id_registro);
        }
        if (acao) {
            sql += ` AND a.acao = ?`;
            params.push(acao);
        }
        if (feito_por_id) {
            sql += ` AND a.feito_por_id = ?`;
            params.push(feito_por_id);
        }

        sql += ` ORDER BY a.feito_em DESC`;

        if (limit) {
            sql += ` LIMIT ?`;
            params.push(parseInt(limit));
        }
        if (offset) {
            sql += ` OFFSET ?`;
            params.push(parseInt(offset));
        }

        const [rows] = await db.execute(sql, params);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar auditorias:', error);
        res.status(500).json({ error: 'Erro ao listar auditorias' });
    }
};

// module.exports = {
//     adicionarAuditoria
// };