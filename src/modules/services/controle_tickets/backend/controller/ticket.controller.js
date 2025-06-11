const db = require('../config/database');

exports.getTickets = (req, res) => {
  db.query('SELECT * FROM TK_tickets', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.createTicket = (req, res) => {
  const { title, description } = req.body;
  db.query('INSERT INTO TK_tickets (title, description) VALUES (?, ?)', [title, description], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, title, description });
  });
};

exports.updateTicket = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  db.query(
    'UPDATE TK_tickets SET title = ?, description = ? WHERE id = ?',
    [title, description, id],
    (err, result) => {
      if (err) throw err;
      res.json({ id, title, description });
    }
  );
};

exports.deleteTicket = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM TK_tickets WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ deleted: true });
  });
};
