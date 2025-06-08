const db = require('../../config/database');
const bcrypt = require('bcrypt');
const Logger = require('../utils/Console_Logger');
const logger = new Logger();

const login = async (req, res) => {
    const { email, password } = req.body;


};

const users = async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM RTS_usuario');
    if (rows.length === 0) {
        return res.status(404).json({ message: 'Nenhum usuário encontrado.' });
    }
    res.status(200).json(rows);
}

const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email e senha são obrigatorios.'});

    try {
        // Lógica de registro
        const [rows] = await db.execute('SELECT * FROM RTS_usuario WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'Email já cadastrado.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute ('INSERT INTO RTS_usuario (email, senha_hash) VALUES (?, ?)', [email, hashedPassword]);
        logger.Success(`Usuário registrado com email: ${email}`);

        res.status(201).json({ message: 'Usuário registrado com sucesso.' });
    } catch (error) {
        logger.Error('Erro ao registrar usuário:', error.message);
        return res.status(500).json({ message: 'Erro ao registrar usuário.' });
        
    }
};

module.exports = {
    login,
    register,
    users
};