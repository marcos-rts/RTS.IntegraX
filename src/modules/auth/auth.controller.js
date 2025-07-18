const db = require('../../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Importa o FileLogger personalizado
// const FileLogger = require('../utils/FileLogger');
// const fileLogger = new FileLogger('../../../logs/app.log', '../../../logs/app.json');
// Importa o Logger personalizado
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
        await db.execute('UPDATE RTS_usuario SET data_login = NOW() WHERE id = ?', [rows[0].id]);
        logger.Success(`Usuário logado com sucesso: ${email}`);
        return res.status(200).json({
            success: true, message: 'Login realizado com sucesso.', token, usuario: {
                usuario: rows[0].usuario, // ou qualquer campo que você tenha
                email: rows[0].email,
                id: rows[0].id,
                tipo: rows[0].tipo
            }
        });


    } catch (error) {
        logger.Error('Erro ao fazer login:', error.message);
        return res.status(500).json({ message: 'Erro ao fazer login.' });
    }

};

const logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: 'Token não fornecido.' });
    }

    try {
        // Decodifica o token para pegar a data de expiração
        const decoded = jwt.decode(token);
        const expTimestamp = decoded.exp * 1000;
        const expirationDate = new Date(expTimestamp);

        await db.execute('INSERT INTO JWT_blacklist (token, expira_em) VALUES (?, ?)', [
            token,
            expirationDate,
        ]);

        await db.execute('UPDATE RTS_usuario SET data_logout = NOW() WHERE id = ?', [req.usuario.id]);

        logger.Info(`Token do usuário com email ${decoded.email} foi invalidado via logout.`);
        res.status(200).json({ message: 'Logout realizado com sucesso.' });
    } catch (error) {
        logger.Error('Erro ao processar logout:', error.message);
        res.status(500).json({ message: 'Erro ao fazer logout.' });
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
    const { email, password, usuario, tipo, criado_por_id, ativo } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email e senha são obrigatorios.' });

    try {
        // Lógica de registro
        const [rows] = await db.execute('SELECT * FROM RTS_usuario WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'Email já cadastrado.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute('INSERT INTO RTS_usuario (email, senha_hash, usuario, tipo, criado_por_id, ativo) VALUES (?, ?, ?, ?, ?, ?)', [email, hashedPassword, usuario, tipo, criado_por_id, ativo]);
        logger.Success(`Usuário registrado com email: ${email}`);

        res.status(201).json({ message: 'Usuário registrado com sucesso.' });
    } catch (error) {
        logger.Error('Erro ao registrar usuário:', error.message);
        return res.status(500).json({ message: 'Erro ao registrar usuário.' });

    }
};

const reset_senha_admin = async (req, res) => {
    const { email, newpassword} = req.body;

    if (!email || !newpassword)
        return res.status(400).json({ message: 'Email e nova senha são obrigatorios.'});

    try {
        //Logica de reset de senha
        const [rows] = await db.execute('SELECT * FROM RTS_usuario WHERE email = ?', [email] );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        if (rows[0].tipo !== 'Admin') {
            return res.status(403).json({ message: 'Apenas administradores podem resetar senhas.' });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        await db.execute('UPDATE RTS_usuario SET senha_hash = ? WHERE email = ?', [hashedPassword, email]);
        logger.Success(`Senha do usuário com email: ${email} foi atualizada com sucesso.`);
        // fileLogger(`Senha do usuário com email: ${email} foi atualizada com sucesso.`);
    } catch (error) {
        logger.Error('Erro ao atualizar senha do usuário:', error.message);
        // fileLogger(`Erro ao atualizar senha do usuário: ${error.message}`);
        return res.status(500).json({ message: 'Erro ao atualizar senha do usuário.' });
    }
}

module.exports = {
    login,
    register,
    users,
    reset_senha_admin,
    logout
};