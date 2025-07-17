const jwt = require('jsonwebtoken');
const db = require('../../config/database');

// Função para verificar se o tokens esta na blacklist
const isTokenBlackListed = async (token) => {
    const [rows] = await db.execute('SELECT * FROM JWT_blacklist WHERE token = ? AND expira_em > NOW()', [token]);
    return rows.lenghth > 0;
}

const autenticar = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Token não fornecido.' });
        }

        const token = authHeader.split(' ')[1]; // "Bearer <token>"

        // Verifica se o token está na blacklist
        const tokenNegado = await isTokenBlackListed(token);
        if (tokenNegado) {
            return res.status(401).json({ message: 'Token foi invalidado (logout).' });
        }

        // Verifica a validade do token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // payload com { id, email }
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = autenticar;