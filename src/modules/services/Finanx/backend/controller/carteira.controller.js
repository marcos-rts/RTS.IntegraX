const db = require('../../../../../config/database');
const auditoriaController = require('../../../../../controller/audit');


// Listar carteiras
exports.listarCarteiras = async (req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT c.id, c.nome, c.descricao, c.ativo, c.excluido, 
             c.criado_em, c.atualizado_em, p.nome AS responsavel
      FROM FX_carteira c
      LEFT JOIN RTS_pessoa p ON c.responsavel_id = p.id
      WHERE c.excluido = FALSE
      ORDER BY c.criado_em DESC
    `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao listar carteiras");
    }
};


// Criar carteira
exports.criarCarteira = async (req, res) => {
    try {
        const { nome, descricao, responsavel_id, criado_por_id } = req.body;

        // Pegando o ID da pessoa logada
        // const responsavel_id = req.user.pessoa_id;
        // const criado_por_id = req.user.id;

        if (!nome || nome.trim() === "") {
            return res.status(400).send("O nome da carteira é obrigatório.");
        }

        const [result] = await db.execute(
            `INSERT INTO FX_carteira 
        (nome, descricao, responsavel_id, criado_por_id, atualizado_por_id) 
       VALUES (?, ?, ?, ?, ?)`,
            [nome, descricao, responsavel_id, criado_por_id, criado_por_id]
        );
        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "FX_carteira",
            id_registro: result.insertId,
            acao: "CRIAR",
            depois: JSON.stringify({ nome, descricao, responsavel_id, criado_por_id }),
            feito_por_id: criado_por_id,
            endpoint: "/api/finanx/carteiras",
            status_code: 201
        })

        res.status(201).send({ id: result.insertId, message: "Carteira criada com sucesso." });
    } catch (err) {
        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "FX_carteira",
            acao: "CRIAR",
            depois: JSON.stringify(req.body),
            feito_por_id: req.user.id,
            endpoint: "/api/finanx/carteiras",
            status_code: 500
        })
        console.error(err);
        res.status(500).send("Erro ao criar carteira");
    }
};
