const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {findUserByEmail, createUser} = require('../models/userModel');

const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });

    const existingUser = findUserByEmail(email);
    if (existingUser)
        return res.status(400).json({ message: 'Usuário já existe.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = createUser({ email, password: hashedPassword });

    res.status(201).json({ message: 'Usuário criado com sucesso.', user: { email: newUser.email } });
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = findUserByEmail(email);
    if (!user)
        return res.status(400).json({ message: 'Usuário não encontrado.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ message: 'Senha incorreta.' });

    const token = jwt.sign({ email:user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login bem-sucedido.', token });
};

module.exports = {
    register,
    login
};