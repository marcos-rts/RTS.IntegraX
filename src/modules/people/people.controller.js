const db = require("../../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auditoriaController = require("../../controller/audit");
// Importa o FileLogger personalizado
// const FileLogger = require('../utils/FileLogger');
// const fileLogger = new FileLogger('../../../logs/app.log', '../../../logs/app.json');
// Importa o Logger personalizado
const Logger = require("../utils/Console_Logger");
const logger = new Logger();

const pessoa = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM vw_pessoa_empresa");
    if (rows.length === 0) {
      // res.json(rows);
      return res.status(404).json({ message: "Nenhuma pessoa encontrada." });
    }
    res.status(200).json(rows);
  } catch (error) {
    logger.error("Erro ao buscar pessoas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const createPessoa = async (req, res) => {
  try {
    const { nome, nome_exibicao, criado_por_id } = req.body;

    if (!nome || !nome_exibicao) {
      return res
        .status(400)
        .json({ error: "Nome e Nome de Exibição são obrigatórios" });
    }
    const [result] = await db.execute(
      `INSERT INTO RTS_pessoa (nome, nome_exibicao, criado_por_id)
             VALUES (?, ?, ?)`,
      [nome, nome_exibicao, criado_por_id]
    );

    await auditoriaController.adicionarAuditoriaInterna({
      tabela: "RTS_pessoa",
      acao: "CRIAR",
      depois: JSON.stringify({ nome, nome_exibicao, criado_por_id }),
      feito_por_id: criado_por_id || null,
      endpoint: "/api/createPessoa",
      status_code: 201,
    });
    logger.Success(`Pessoa criada com sucesso: ID ${result.insertId}`);
    res.status(201).json({
      message: "Pessoa criada com sucesso!",
      id: result.insertId,
      data: { nome, nome_exibicao },
    });
  } catch (error) {
    await auditoriaController.adicionarAuditoriaInterna({
      tabela: "RTS_pessoa",
      acao: "CRIAR",
      depois: JSON.stringify(req.body),
      feito_por_id: req.body.criado_por_id || null,
      endpoint: "/api/createPessoa",
      status_code: 500,
    });
    logger.Error("Erro ao criar pessoa:", error);
    res
      .status(500)
      .json({ error: "Erro ao criar pessoa", details: error.message });
  }
};

module.exports = {
  pessoa,
  createPessoa,
};
