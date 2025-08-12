const express = require('express');
const cors = require('cors');
const path = require('path');

const router = express.Router();
const finanxRoutes = require('./backend/routes/primary');

function setupFinanxModule(app) {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/finanx', finanxRoutes);
}

module.exports = setupFinanxModule;