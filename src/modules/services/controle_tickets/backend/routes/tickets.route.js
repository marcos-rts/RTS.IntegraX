const express = require('express');
const router = express.Router();
const ticketController = require('../controller/ticket.controller');
const authMiddleware = require('./../../../../auth/auth.middleware')

router.get('/protegido', authMiddleware, (req, res) => {
    res.json({ message: `Você está autenticado como ${req.usuario.email}` });
});

router.get('/', ticketController.getTickets);
router.post('/', ticketController.createTicket);
router.put('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);


module.exports = router;