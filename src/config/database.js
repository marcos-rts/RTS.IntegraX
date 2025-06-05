require('dotenv').config();
const mysql = require('mysql2');

const config = {
    production: {
        database: process.env.DB_NAME
    },
    development: {
        database: process.env.DB_NAME_TESTE
    }
};

const env = process.env.NODE_ENV || 'development';
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: config[env].database
});

connection.connect((err) => {
    if (err) {
        console.error('🔴 Erro ao conectar:', err);
        return;
    }
    console.log(`🟢 Conectado ao banco: ${connection.config.database} (${env})`);
});

module.exports = connection;