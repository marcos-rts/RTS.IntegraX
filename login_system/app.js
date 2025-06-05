const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const privateRoutes = require('./src/routes/privateRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes); // todas as rotas de autenticação
// app.use('/api/private', privateRoutes); // todas as rotas privadas

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));