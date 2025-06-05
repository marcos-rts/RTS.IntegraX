const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    findUserByEmail,
    createUser,
    saveRefreshToken,
    removeRefreshToken,
    findUserByRefreshToken
} = require('../models/userModel');
const User = require('../models/user'); // Importa o modelo User

const generateAccessToken = (user) => {
    return jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Token bem curto
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' } // Token mais longo
    );
};

const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });

    try {
        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email já cadastrado.' });
        }

        // Cria hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cia usuario no banco
        await User.create({
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    };

    // const existingUser = findUserByEmail(email);
    // if (existingUser)
    //     return res.status(409).json({ message: 'Usuário já existe.' });

    // const hashedPassword = await bcrypt.hash(password, 10);
    // const newUser = createUser({ email, password: hashedPassword });

    // res.status(201).json({ message: 'Usuário criado com sucesso', user: { email: newUser.email } });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Procura usuário
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verifica senha
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Gera tokens
        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Salva refresh no banco
        user.refreshToken = refreshToken;
        await user.save();

        // Retorna os tokens
        res.json({
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }

    // const user = findUserByEmail(email);
    // if (!user)
    //     return res.status(401).json({ message: 'Credenciais inválidas' });

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch)
    //     return res.status(401).json({ message: 'Credenciais inválidas' });

    // const accessToken = generateAccessToken(user);
    // const refreshToken = generateRefreshToken(user);

    // saveRefreshToken(email, refreshToken);

    // res.status(200).json({
    //     message: 'Login bem-sucedido',
    //     accessToken,
    //     refreshToken
    // });
};

const refresh = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token não fornecido' });
    }

    const user = findUserByRefreshToken(refreshToken);
    if (!user) {
        return res.status(403).json({ message: 'Refresh Token inválido' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Refresh Token inválido' });
        }

        const accessToken = generateAccessToken({ email: decoded.email });
        res.status(200).json({ accessToken });
    });
};

const logout = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh Token não fornecido' });
    }

    const user = findUserByRefreshToken(refreshToken);
    if (user) {
        removeRefreshToken(user.email);
    }

    res.status(200).json({ message: 'Logout bem-sucedido' });
};

module.exports = { register, login, refresh, logout };
