const express = require('express');
const router = express.Router();
const ticketController = require('../controller/ticket.controller');

router.get('/', ticketController.getTickets);
router.post('/', ticketController.createTicket);
router.put('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);


module.exports = router;