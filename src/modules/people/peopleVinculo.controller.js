// controller/people/peopleVinculo.controller.js
const db = require('../../config/database');
const auditoriaController = require('../../controller/audit');
const Logger = require('../utils/Console_Logger');
const logger = new Logger();

// 🔹 LISTAR TODOS OS VÍNCULOS
const listarVinculos = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT v.*, 
             p.nome AS pessoa_nome, 
             e.nome_fantasia AS empresa_nome 
      FROM RTS_pessoa_vinculo v
      JOIN RTS_pessoa p ON v.pessoa_id = p.id
      JOIN RTS_empresa e ON v.empresa_id = e.id
      WHERE p.excluido = FALSE
    `);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum vínculo encontrado.' });
    }

    res.status(200).json(rows);
  } catch (error) {
    logger.Error('Erro ao buscar vínculos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// 🔹 CRIAR VÍNCULO
const criarVinculo = async (req, res) => {
  try {
    const {
      pessoa_id,
      empresa_id,
      tipo_vinculo,
      cargo,
      data_inicio,
      data_fim,
      observacao,
      criado_por_id,
    } = req.body;

    if (!pessoa_id || !empresa_id || !tipo_vinculo) {
      return res
        .status(400)
        .json({ error: 'Campos obrigatórios: pessoa_id, empresa_id, tipo_vinculo' });
    }

    const [result] = await db.execute(
      `
      INSERT INTO RTS_pessoa_vinculo (
        pessoa_id, empresa_id, tipo_vinculo, cargo, data_inicio, data_fim, observacao, criado_por_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [pessoa_id, empresa_id, tipo_vinculo, cargo, data_inicio || null, data_fim || null, observacao || null, criado_por_id]
    );

    await auditoriaController.adicionarAuditoriaInterna({
      tabela: 'RTS_pessoa_vinculo',
      acao: 'CRIAR',
      depois: JSON.stringify(req.body),
      feito_por_id: criado_por_id || null,
      endpoint: '/api/vinculos/create',
      status_code: 201,
    });

    logger.Success(`Vínculo criado com sucesso: ID ${result.insertId}`);

    res.status(201).json({
      message: 'Vínculo criado com sucesso!',
      id: result.insertId,
    });
  } catch (error) {
    await auditoriaController.adicionarAuditoriaInterna({
      tabela: 'RTS_pessoa_vinculo',
      acao: 'CRIAR',
      depois: JSON.stringify(req.body),
      feito_por_id: req.body.criado_por_id || null,
      endpoint: '/api/vinculos/create',
      status_code: 500,
    });
    logger.Error('Erro ao criar vínculo:', error);
    res.status(500).json({ error: 'Erro ao criar vínculo', details: error.message });
  }
};

// 🔹 ATUALIZAR VÍNCULO
const atualizarVinculo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tipo_vinculo,
      cargo,
      data_inicio,
      data_fim,
      observacao,
      atualizado_por_id,
    } = req.body;

    const [existe] = await db.execute('SELECT * FROM RTS_pessoa_vinculo WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ error: 'Vínculo não encontrado.' });
    }

    await db.execute(
      `
      UPDATE RTS_pessoa_vinculo
      SET tipo_vinculo = ?, cargo = ?, data_inicio = ?, data_fim = ?, observacao = ?, atualizado_por_id = ?
      WHERE id = ?
    `,
      [tipo_vinculo, cargo, data_inicio, data_fim, observacao, atualizado_por_id, id]
    );

    await auditoriaController.adicionarAuditoriaInterna({
      tabela: 'RTS_pessoa_vinculo',
      acao: 'ATUALIZAR',
      antes: JSON.stringify(existe[0]),
      depois: JSON.stringify(req.body),
      feito_por_id: atualizado_por_id || null,
      endpoint: '/api/vinculos/update/' + id,
      status_code: 200,
    });

    logger.Success(`Vínculo atualizado com sucesso: ID ${id}`);

    res.status(200).json({ message: 'Vínculo atualizado com sucesso.' });
  } catch (error) {
    logger.Error('Erro ao atualizar vínculo:', error);
    res.status(500).json({ error: 'Erro ao atualizar vínculo', details: error.message });
  }
};

// 🔹 EXCLUIR (REMOVER DEFINITIVAMENTE)
const excluirVinculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { atualizado_por_id } = req.body;

    const [existe] = await db.execute('SELECT * FROM RTS_pessoa_vinculo WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ error: 'Vínculo não encontrado.' });
    }

    await db.execute('DELETE FROM RTS_pessoa_vinculo WHERE id = ?', [id]);

    await auditoriaController.adicionarAuditoriaInterna({
      tabela: 'RTS_pessoa_vinculo',
      acao: 'DELETAR',
      antes: JSON.stringify(existe[0]),
      feito_por_id: atualizado_por_id || null,
      endpoint: '/api/vinculos/delete/' + id,
      status_code: 200,
    });

    logger.Success(`Vínculo removido com sucesso: ID ${id}`);
    res.status(200).json({ message: 'Vínculo removido com sucesso.' });
  } catch (error) {
    logger.Error('Erro ao excluir vínculo:', error);
    res.status(500).json({ error: 'Erro ao excluir vínculo', details: error.message });
  }
};

module.exports = {
  listarVinculos,
  criarVinculo,
  atualizarVinculo,
  excluirVinculo,
};
