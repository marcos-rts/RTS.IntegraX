const express = require('express');
const cors = require('cors');
const path = require('path');

const router = express.Router();
const ticketsRoutes = require('./backend/routes/tickets.route');

function setupTicketsModule(app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/tickets', ticketsRoutes);
}