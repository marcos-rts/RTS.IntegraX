const db = require('../config/database');
const Logger = require('../modules/utils/Console_Logger');
const FileLogger = require('../modules/utils/FileLogger');

const logger = new Logger();
const fileLogger = new FileLogger('../../logs/app.log', '../../logs/app.json');

const status = async (req, res) => {
    const { tipoBanco } = req.query;
    try {
        const [rows] = await db.execute(
            'SELECT * FROM vw_status_simples WHERE nome_Banco = ?',
            [tipoBanco]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Nenhum Status encontrado' });
        }
        res.status(200).json(rows);
    } catch (error) {
        logger.error('Error fetching status:', error);
        fileLogger.error('Error fetching status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    status
};