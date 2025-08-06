const db = require('../../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Importa o FileLogger personalizado
// const FileLogger = require('../utils/FileLogger');
// const fileLogger = new FileLogger('../../../logs/app.log', '../../../logs/app.json');
// Importa o Logger personalizado
const Logger = require('../utils/Console_Logger');
const logger = new Logger();

const pessoa = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM vw_pessoa_simples');
        if (rows.length === 0) {
            // res.json(rows);
            return res.status(404).json({ message: 'Nenhuma pessoa encontrada.' });
        }
        res.status(200).json(rows);
    } catch (error) {
        logger.error('Erro ao buscar pessoas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = {
    pessoa
}; 