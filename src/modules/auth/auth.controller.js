const db = require('../../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Logger = require('../utils/Console_Logger');
const logger = new Logger();

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Procura o usuário pelo email
        const [rows] = await db.execute('SELECT * FROM RTS_usuario WHERE email = ?', [email])
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Verifica a senha
        const validaSenha = await bcrypt.compare(password, rows[0].senha_hash);
        if (!validaSenha) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: rows[0].id, email: rows[0].email }, //payload
            process.env.JWT_SECRET, // Chave secreta do JWT
            { expiresIn: '2h' } // Opções do token
        )

        // Login bem-sucedido
        logger.Success(`Usuário logado com sucesso: ${email}`);
        return res.status(200).json({
            success: true, message: 'Login realizado com sucesso.', token, usuario: {
                usuario: rows[0].usuario, // ou qualquer campo que você tenha
                email: rows[0].email
            }
        });


    } catch (error) {
        logger.Error('Erro ao fazer login:', error.message);
        return res.status(500).json({ message: 'Erro ao fazer login.' });
    }

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
        return res.status(400).json({ message: 'Email e senha são obrigatorios.' });

    try {
        // Lógica de registro
        const [rows] = await db.execute('SELECT * FROM RTS_usuario WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'Email já cadastrado.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute('INSERT INTO RTS_usuario (email, senha_hash) VALUES (?, ?)', [email, hashedPassword]);
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