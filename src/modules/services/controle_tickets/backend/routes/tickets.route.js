const express = require('express');
const router = express.Router();
const ticketController = require('../controller/ticket.controller');
const authMiddleware = require('./../../../../auth/auth.middleware')

router.use(authMiddleware);

router.get('/', ticketController.getTickets);
router.post('/', ticketController.createTicket);
router.put('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);
router.get('/:id', ticketController.getTicketById);


module.exports = router;