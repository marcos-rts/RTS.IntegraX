const db = require('../../../../../config/database');
const auditoriaController = require('../../../../../controller/audit');

// Criar transação
exports.createTransacao = async (req, res) => {
    try {
        const {
            valor, tipo, informacao, conta_id, conta_2_id,
            subcategoria_id, pessoa_id, observacao, status_id,
            criado_por_id
        } = req.body;

        const [result] = await db.execute(
            `INSERT INTO FX_transacao 
        (valor, tipo, informacao, conta_id, conta_2_id, subcategoria_id, pessoa_id, observacao, status_id, criado_por_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [valor, tipo, informacao, conta_id, conta_2_id, subcategoria_id, pessoa_id, observacao, status_id, criado_por_id]
        );

        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "FX_transacao",
            id_registro: result.insertId,
            acao: "CRIAR",
            depois: JSON.stringify({ valor, tipo, informacao, conta_id, conta_2_id, subcategoria_id, pessoa_id, observacao, status_id, criado_por_id }),
            feito_por_id: criado_por_id,
            endpoint: "/api/finanx/transacoes",
            status_code: 201
        })

        res.status(201).json({ id: result.insertId, message: "Transação criada com sucesso" });
    } catch (err) {
        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "FX_transacao",
            acao: "CRIAR",
            depois: JSON.stringify(req.body),
            feito_por_id: req.body.criado_por_id,
            endpoint: "/api/finanx/transacoes",
            status_code: 500
        })
        console.error("Erro ao criar transação:", err);
        res.status(500).json({ error: "Erro ao criar transação" });
    }
};

// Listar todas as transações
exports.getAllTransacoes = async (req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT t.*, 
             c.nome AS conta_nome, 
             c2.nome AS conta_2_nome, 
             s.nome AS status_nome, 
             sub.nome AS subcategoria_nome,
             p.nome AS pessoa_nome
      FROM FX_transacao t
      LEFT JOIN FX_conta c ON t.conta_id = c.id
      LEFT JOIN FX_conta c2 ON t.conta_2_id = c2.id
      LEFT JOIN RTS_status s ON t.status_id = s.id
      LEFT JOIN FX_subcategoria sub ON t.subcategoria_id = sub.id
      LEFT JOIN RTS_pessoa p ON t.pessoa_id = p.id
      WHERE t.excluido = FALSE
    `);

        res.json(rows);
    } catch (err) {
        console.error("Erro ao listar transações:", err);
        res.status(500).json({ error: "Erro ao buscar transações" });
    }
};

// Buscar uma transação pelo ID
exports.getTransacaoById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.execute(
            `SELECT * FROM FX_transacao WHERE id = ? AND excluido = FALSE`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Transação não encontrada" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Erro ao buscar transação:", err);
        res.status(500).json({ error: "Erro ao buscar transação" });
    }
};

// Atualizar transação
exports.updateTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            valor, tipo, informacao, conta_id, conta_2_id,
            subcategoria_id, pessoa_id, observacao, status_id,
            atualizado_por_id
        } = req.body;

        const [result] = await db.execute(
            `UPDATE FX_transacao SET 
        valor=?, tipo=?, informacao=?, conta_id=?, conta_2_id=?, 
        subcategoria_id=?, pessoa_id=?, observacao=?, status_id=?, 
        atualizado_por_id=? 
       WHERE id=? AND excluido = FALSE`,
            [valor, tipo, informacao, conta_id, conta_2_id, subcategoria_id, pessoa_id, observacao, status_id, atualizado_por_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Transação não encontrada" });
        }

        res.json({ message: "Transação atualizada com sucesso" });
    } catch (err) {
        console.error("Erro ao atualizar transação:", err);
        res.status(500).json({ error: "Erro ao atualizar transação" });
    }
};

// Deletar (soft delete)
exports.deleteTransacao = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute(
            `UPDATE FX_transacao SET excluido = TRUE WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Transação não encontrada" });
        }

        res.json({ message: "Transação excluída com sucesso" });
    } catch (err) {
        console.error("Erro ao excluir transação:", err);
        res.status(500).json({ error: "Erro ao excluir transação" });
    }
};
