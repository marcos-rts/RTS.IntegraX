const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const authRoutes = require('./src/routes/authRoutes');
app.use('/api', authRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
