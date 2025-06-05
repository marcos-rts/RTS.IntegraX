require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const user = require('./models/user');

app.use(express.json());

// Rotas
app.use('/api', authRoutes);

// Banco conectado
sequelize.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('🚀 Server rodando na porta 3000');
    });
  })
  .catch(err => console.error('Erro ao conectar no banco:', err));
