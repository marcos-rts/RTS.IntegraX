const db = require('./../../../../../config/database');

exports.getTickets = async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM TK_tickets');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tickets', details: err.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const [result] = await db.execute(
      'INSERT INTO TK_tickets (title, description) VALUES (?, ?)',
      [title, description]
    );
    res.json({ id: result.insertId, title, description });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar ticket', details: err.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    await db.execute(
      'UPDATE TK_tickets SET title = ?, description = ? WHERE id = ?',
      [title, description, id]
    );
    res.json({ id, title, description });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar ticket', details: err.message });
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
