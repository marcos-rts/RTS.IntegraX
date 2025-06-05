require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT, // 👈 A porta vai aqui, SEPARADO
        dialect: 'mysql', // ou 'postgres', 'sqlite', etc.
        logging: false, // Desativa logs SQL
    }
);

sequelize.authenticate()
    .then(() => console.log('🟢 Conectado ao banco MySQL'))
    .catch(err => console.error('🔴 Erro ao conectar no banco:', err));

module.exports = sequelize;

