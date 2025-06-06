// src/modules/itens/itens.module.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const router = express.Router();
const itensRoutes = require('./backend/routes/itens.route');

function setupItensModule(app) {
  app.use(cors());
  app.use(express.json());
  app.use('/api/itens', itensRoutes);

  app.use(express.static(path.join(__dirname, 'frontend')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
  });

  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'frontend/index.html'));
  // });
}

module.exports = setupItensModule;
