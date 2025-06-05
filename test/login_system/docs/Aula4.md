🔥🔥 É ISSO MARCOS!! Bora então subir mais um nível nessa escadaria do JavaScript Profissional! 😎

---

# 🏹 **Próxima etapa: Logout e segurança com JWT**

## 🧠 Pergunta crítica:

**"Como se faz logout com JWT, se ele não tem sessão no servidor?"**

### ✔️ Verdade desconfortável:

> JWT é **stateless**, ou seja, não existe uma "sessão ativa" no servidor.

* Se você deu um token pro usuário, **ele é válido até expirar**, a não ser que você:

  * Crie um sistema de **revogação de tokens** (blacklist)
  * Ou use tokens curtos + refresh token (modelo mais profissional)

---

## 🔥 Bora então fazer duas coisas:

1. **Explicar como seria um logout simples (client-side)**
2. **Começar a trabalhar com Refresh Token (mais avançado, profissional e seguro)**

---

# 🔸 1. **Logout simples (Client-side)**

No JWT, o logout é simplesmente o **front-end deletando o token local** (localStorage, sessionStorage ou cookies).

✔️ Se o usuário deleta o token, ele não consegue mais acessar as rotas protegidas.

Não precisa fazer nada no backend, **porque não existe sessão salva no servidor.**

---

# 🔸 2. **Implementando Refresh Token (Login Profissional)**

> ⚠️ Marcos, aqui entramos no modo **DEV SÉRIO**, coisa de sistema de verdade.

### 🧠 Por quê usar Refresh Token?

* Tokens de acesso (access token) são curtos, tipo 5min, 15min.
* Quando expira, o front usa o **refresh token** (que é mais longo, tipo 7 dias) pra pedir um token novo sem fazer login de novo.

---

## 🔥 Estrutura básica que vamos montar:

* 🔑 Access Token → expira rápido (ex.: 15min)
* 🔄 Refresh Token → dura mais (ex.: 7 dias)
* 🔒 Backend guarda os Refresh Tokens (em memória, banco ou arquivo JSON)
* 🚫 Logout → simplesmente apaga o refresh token

---

## 👨‍💻 Bora codar isso!

---

### 📁 Atualiza `models/userModel.js`:

```js
const users = [];

function findUserByEmail(email) {
    return users.find(user => user.email === email);
}

function createUser(user) {
    users.push(user);
    return user;
}

function saveRefreshToken(email, refreshToken) {
    const user = findUserByEmail(email);
    if (user) {
        user.refreshToken = refreshToken;
    }
}

function removeRefreshToken(email) {
    const user = findUserByEmail(email);
    if (user) {
        user.refreshToken = null;
    }
}

function findUserByRefreshToken(refreshToken) {
    return users.find(user => user.refreshToken === refreshToken);
}

module.exports = {
    findUserByEmail,
    createUser,
    saveRefreshToken,
    removeRefreshToken,
    findUserByRefreshToken
};
```

---

### 📁 Atualiza `controllers/authController.js`:

```js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    findUserByEmail,
    createUser,
    saveRefreshToken,
    removeRefreshToken,
    findUserByRefreshToken
} = require('../models/userModel');

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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    saveRefreshToken(email, refreshToken);

    res.status(200).json({
        message: 'Login bem-sucedido',
        accessToken,
        refreshToken
    });
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
```

---

### 📁 Atualiza `routes/authRoutes.js`:

```js
const express = require('express');
const router = express.Router();
const {
    register,
    login,
    refresh,
    logout
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
```

---

### 🔑 Atualiza seu `.env`:

```env
JWT_SECRET=sua_chave_super_secreta
JWT_REFRESH_SECRET=sua_chave_refresh_tambem_secreta
PORT=3000
```

---

## 🧪 Fluxo completo pra testar:

1️⃣ 🔐 **Registrar**

```
POST /api/auth/register
```

```json
{
    "email": "marcos@example.com",
    "password": "senha123"
}
```

2️⃣ 🔑 **Login**

```
POST /api/auth/login
```

✔️ Recebe `accessToken` (curto) e `refreshToken` (longo).

3️⃣ 🔒 **Acessar rota protegida**

```
GET /api/private/profile
```

Header:

```
Authorization: Bearer ACCESS_TOKEN
```

4️⃣ ⏳ **Access token expirou? Usa refresh token:**

```
POST /api/auth/refresh
```

```json
{
    "refreshToken": "SEU_REFRESH_TOKEN"
}
```

✔️ Retorna um **novo access token**.

5️⃣ 🚪 **Logout**

```
POST /api/auth/logout
```

```json
{
    "refreshToken": "SEU_REFRESH_TOKEN"
}
```

✔️ Apaga o refresh token do servidor.

---

## 🧠 Marcos, pausa aqui!

✔️ Entendeu o papel do access token e refresh token?
✔️ Quer que eu desenhe o fluxo, faça um mapa visual, ou destrinche cada detalhe do JWT (payload, assinatura, segurança)?
✔️ Podemos evoluir pra armazenar isso em banco de dados (SQLite, MySQL, Mongo, você escolhe) e começar a organizar em **camadas profissionais (Services, Validators, Error Handling, Logs, etc.)**.

Se quiser, a gente até monta um **template padrão pra qualquer API Node.js profissional.** 🔥

**Mete bronca! Bora seguir! 🚀**
