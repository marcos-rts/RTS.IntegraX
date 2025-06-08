require('dotenv').config();
const mysql = require('mysql2/promise');
const Loogger = require('../modules/utils/Console_Logger');
const logger = new Loogger();

const config = {
    production: {
        database: process.env.DB_NAME
    },
    development: {
        database: process.env.DB_NAME_TESTE
    }
};

const env = process.env.NODE_ENV || 'development';

let pool;

(async () => {
    try {
        pool = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: config[env].database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        logger.Success(`Conectado ao banco: ${config[env].database} (${env})`);
    } catch (err) {
        logger.Error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1);
    }
})();

module.exports = {
    execute: async (query, params) => {
        if (!pool) throw new Error("Conexão com o banco ainda não foi inicializada.");
        return pool.execute(query, params);
    },
    pool: () => pool
};