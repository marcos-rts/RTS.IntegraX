const db = require('./../../../../../config/database');
const auditoriaController = require('../../../../../controller/audit');


exports.getTickets = async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM vw_tickets_simples');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tickets', details: err.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { title, description, data_criacao, prioridade, status_id, grupo_id, solicitante_id, url_github, criado_por_id } = req.body;

    // Validação básica (pode expandir depois com lib tipo Joi ou express-validator)
    if (!title || !description || !prioridade || !status_id || !grupo_id || !criado_por_id) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando',
        details: { title, description, prioridade, status_id, grupo_id, criado_por_id }
      });
    }

    // Inserção no banco de dados
    const [result] = await db.execute(
      `INSERT INTO TK_tickets (title, description, data_criacao, prioridade, status_id, grupo_id, solicitante_id, url_github, criado_por_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, data_criacao, prioridade, status_id, grupo_id, solicitante_id || null, url_github || null, criado_por_id]
    );

    await auditoriaController.adicionarAuditoriaInterna({
      tabela: "TK_tickets",
      acao: "CRIAR",
      depois: JSON.stringify({ title, description, data_criacao, prioridade, status_id, grupo_id, solicitante_id, url_github, criado_por_id }),
      feito_por_id: criado_por_id,
      endpoint: "/api/tickets",
      status_code: 201
    })

    res.status(201).json({
      message: 'Ticket criado com sucesso!',
      id: result.insertId,
      data: { title, description, prioridade, status_id, grupo_id }
    });

  } catch (err) {
    await auditoriaController.adicionarAuditoriaInterna({
      tabela: "TK_tickets",
      acao: "CRIAR",
      depois: JSON.stringify(req.body),
      feito_por_id: req.body.criado_por_id,
      endpoint: "/api/tickets",
      status_code: 500
    })
    console.error("Erro ao criar ticket:", err); // log pro console local
    res.status(500).json({ error: 'Erro ao criar ticket', details: err.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID do ticket é obrigatório' });
    }

    const [rows] = await db.execute(
      'SELECT * FROM vw_tickets_completo WHERE id_ticket = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    // Montar o objeto principal do ticket com base na primeira linha
    const {
      id_ticket,
      title_ticket,
      description_ticket,
      status,
      cor_Status,
      prioriedade_ticket,
      Grupo,
      cor_Grupo,
      id_pessoa,
      nome_pessoa,
      url_repositorio,
    } = rows[0];

    // Mapear todas as integrações do GitHub
    const github_itens = rows
      .filter(r => r.github_id !== null) // descarta nulls (se o ticket não tiver vinculação com GitHub)
      .map(r => ({
        github_id: r.github_id,
        tipo: r.tipo_github,
        titulo: r.titulo_github,
        status: r.status_github,
        url: r.url_github,
      }));

    // Retornar um objeto bem estruturado
    const ticketCompleto = {
      id_ticket,
      title_ticket,
      description_ticket,
      status,
      cor_Status,
      prioriedade_ticket,
      Grupo,
      cor_Grupo,
      id_pessoa,
      nome_pessoa,
      url_repositorio,
      github_itens, // Aqui vai como array
    };

    res.json(ticketCompleto);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar ticket específico', details: err.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, prioridade, status_id, grupo_id, solicitante_id, url_repositorio, atualizado_por_id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do ticket é obrigatório" });
    }

    // Atualização
    const [result] = await db.execute(
      `UPDATE TK_tickets 
       SET title = ?, description = ?, prioridade = ?, status_id = ?, grupo_id = ?, solicitante_id = ?, url_repositorio = ?, atualizado_em = NOW(), atualizado_por_id = ?
       WHERE id_ticket = ?`,
      [title, description, prioridade, status_id, grupo_id, solicitante_id || null, url_repositorio || null, atualizado_por_id || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket não encontrado" });
    }

    await auditoriaController.adicionarAuditoriaInterna({
      tabela: "TK_tickets",
      acao: "EDITAR",
      antes: null, // se quiser, dá pra buscar antes
      depois: JSON.stringify(req.body),
      feito_por_id: atualizado_por_id,
      endpoint: `/api/tickets/${id}`,
      status_code: 200
    });

    res.json({ message: "Ticket atualizado com sucesso!", id });
  } catch (err) {
    console.error("Erro ao atualizar ticket:", err);
    res.status(500).json({ error: "Erro ao atualizar ticket", details: err.message });
  }
};


exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM TK_tickets WHERE id = ?', [id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar ticket', details: err.message });
  }
};
