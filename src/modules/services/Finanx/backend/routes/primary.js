const express = require('express');
const router = express.Router();
const ticketController = require('../controller/primary');
const authMiddleware = require('./../../../../auth/auth.middleware')

router.use(authMiddleware);