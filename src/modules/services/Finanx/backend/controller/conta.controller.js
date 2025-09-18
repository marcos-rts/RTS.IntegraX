const db = require('../../../../../config/database');
const auditoriaController = require('../../../../../controller/audit');

// Listar contas
exports.listarContas = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                c.id, c.nome, c.valor, c.descricao, c.tipo, 
                c.ativo, c.excluido, c.criado_em, c.atualizado_em,
                crt.nome AS carteira,
                s.nome AS status
            FROM FX_conta c
            LEFT JOIN FX_carteira crt ON c.carteira_id = crt.id
            LEFT JOIN RTS_status s ON c.status_id = s.id
            WHERE c.excluido = FALSE
            ORDER BY c.criado_em DESC
        `);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao listar contas");
    }
};

// Criar conta
exports.criarConta = async (req, res) => {
    try {
        const { carteira_id, nome, valor, descricao, tipo, status_id, criado_por_id } = req.body;

        if (!nome || nome.trim() === "") {
            return res.status(400).send("O nome da conta é obrigatório.");
        }
        if (!carteira_id) {
            return res.status(400).send("A conta deve estar vinculada a uma carteira.");
        }

        const [result] = await db.execute(
            `INSERT INTO FX_conta 
            (carteira_id, nome, valor, descricao, tipo, status_id, criado_por_id, atualizado_por_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [carteira_id, nome, valor || 0.0, descricao, tipo || 'Debito', status_id, criado_por_id, criado_por_id]
        );

        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "FX_conta",
            id_registro: result.insertId,
            acao: "CRIAR",
            depois: JSON.stringify({ carteira_id, nome, valor, descricao, tipo, status_id, criado_por_id }),
            feito_por_id: criado_por_id,
            endpoint: "/api/finanx/contas",
            status_code: 201
        });

        res.status(201).send({ id: result.insertId, message: "Conta criada com sucesso." });
    } catch (err) {
        // TODO Erro ao criar conta - Auditoria
        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "FX_conta",
            acao: "CRIAR",
            depois: JSON.stringify(req.body),
            feito_por_id: req.user?.id || null,
            endpoint: "/api/finanx/contas",
            status_code: 500
        });
        console.error(err);
        res.status(500).send("Erro ao criar conta");
    }
};

// Atualizar conta
exports.atualizarConta = async (req, res) => {
    try {
        const { id } = req.params;
        const { carteira_id, nome, valor, descricao, tipo, status_id, atualizado_por_id } = req.body;

        const [antesRows] = await db.execute("SELECT * FROM FX_conta WHERE id = ?", [id]);
        if (antesRows.length === 0) {
            return res.status(404).send("Conta não encontrada.");
        }

        await db.execute(
            `UPDATE FX_conta 
             SET carteira_id=?, nome=?, valor=?, descricao=?, tipo=?, status_id=?, atualizado_por_id=? 
             WHERE id=?`,
            [carteira_id, nome, valor, descricao, tipo, status_id, atualizado_por_id, id]
        );

        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "FX_conta",
            id_registro: id,
            acao: "EDITAR",
            antes: JSON.stringify(antesRows[0]),
            depois: JSON.stringify({ carteira_id, nome, valor, descricao, tipo, status_id }),
            feito_por_id: atualizado_por_id,
            endpoint: `/api/finanx/contas/${id}`,
            status_code: 200
        });

        res.status(200).send({ id, message: "Conta atualizada com sucesso." });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar conta");
    }
};

// Excluir conta (soft delete)
exports.excluirConta = async (req, res) => {
    try {
        const { id } = req.params;
        const feito_por_id = req.body.feito_por_id;

        const [antesRows] = await db.execute("SELECT * FROM FX_conta WHERE id = ?", [id]);
        if (antesRows.length === 0) {
            return res.status(404).send("Conta não encontrada.");
        }

        await db.execute(
            `UPDATE FX_conta 
             SET excluido=TRUE, atualizado_por_id=? 
             WHERE id=?`,
            [feito_por_id, id]
        );

        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "FX_conta",
            id_registro: id,
            acao: "EXCLUIR",
            antes: JSON.stringify(antesRows[0]),
            feito_por_id,
            endpoint: `/api/finanx/contas/${id}`,
            status_code: 200
        });

        res.status(200).send({ id, message: "Conta excluída com sucesso." });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao excluir conta");
    }
};
