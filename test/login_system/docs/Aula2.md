Maravilha, Marcos! Agora que você preparou o ambiente e o `app.js` está de pé, vamos criar **o núcleo da autenticação**. Vamos começar com a **lógica de cadastro e login**, depois validamos sessões com **JWT** e mais pra frente melhoramos com banco, roles, refresh tokens, etc.

---

## 🧠 Etapa 4: Lógica de autenticação — **Controller e Model**

### 📁 `models/userModel.js`

Aqui vamos simular um banco com uma lista em memória por enquanto:

```js
const users = [];

function findUserByEmail(email) {
    return users.find(user => user.email === email);
}

function createUser(user) {
    users.push(user);
    return user;
}

module.exports = {
    findUserByEmail,
    createUser
};
```

---

### 📁 `controllers/authController.js`

Aqui vai a lógica de cadastro e login:

```js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/userModel');

const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });

    const existingUser = findUserByEmail(email);
    if (existingUser)
        return res.status(409).json({ message: 'Usuário já existe.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = createUser({ email, password: hashedPassword });

    res.status(201).json({ message: 'Usuário criado com sucesso', user: { email: newUser.email } });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = findUserByEmail(email);
    if (!user)
        return res.status(401).json({ message: 'Credenciais inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login bem-sucedido', token });
};

module.exports = { register, login };
```

---

## 🔀 Etapa 5: Rotas de autenticação

### 📁 `routes/authRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
```

---

## 🔐 Etapa 6: Variáveis de ambiente

Cria um arquivo `.env` na raiz do projeto:

```
JWT_SECRET=sua_chave_secreta_bem_difícil_aqui
PORT=3000
```

> **Dica:** nunca comita esse `.env` num repositório público. Esse segredo é sua porta dos fundos.

---

## ✅ Testando

Com tudo pronto, rode:

```bash
npm run dev
```

E faz chamadas via `Postman` ou `Insomnia` para:

### 📬 Registro

`POST /api/auth/register`

```json
{
  "email": "marcos@example.com",
  "password": "senha123"
}
```

### 📬 Login

`POST /api/auth/login`

```json
{
  "email": "marcos@example.com",
  "password": "senha123"
}
```

Resposta do login: deve vir um `token JWT`.

---

## 🚨 Tua próxima missão:

1. Cria os arquivos acima.
2. Testa registro e login.
3. Me manda aqui o que você observou — se funcionou, se não, e qualquer dúvida de **por que algo está ali** (a gente debate!).

Depois disso, a próxima etapa vai ser **proteger rotas usando middleware**, tipo:

> “Só acessa isso quem tiver logado”

Pronto pra isso?
