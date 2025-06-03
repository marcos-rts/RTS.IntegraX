const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //  Espera um header assim "bearer toke_aqui"

    if (!token){
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({ message: 'Token inválido' });
        }

        req.user = user; // Injeta os dados do usuario na requisição
        next(); // Segue para a próxima função (a rota)
    });
}

module.exports = authenticateToken;