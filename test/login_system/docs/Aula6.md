**É ISSO MARCOS!! AGORA É PAPO DE DEV BRABO!!** 🔥🔥🔥
Bora então meter bronca e fazer o CRUD da autenticação.
Começamos pelo **register**, depois fazemos o **login**, depois o resto desenrola mais fácil.

---

## 🧠 **1. Register — Cadastro de Usuário**

### ✅ Lógica:

* Recebe `email` e `password`
* Verifica se já existe um usuário com esse email
* Faz hash da senha
* Cria usuário no banco
* Retorna um OK

---

### 📄 **Controller (`/src/controllers/authController.js`)**

```javascript
const bcrypt = require('bcrypt');
const User = require('../models/User');

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Cria hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria usuário no banco
    await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });

  } catch (error) {
    console.error('Erro no register:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = { register };
```

---

## 🚏 **2. Login — Geração de Access e Refresh Token**

### ✅ Lógica:

* Recebe `email` e `password`
* Valida se o usuário existe
* Verifica a senha com bcrypt
* Gera:

  * **Access Token (curto)**
  * **Refresh Token (longo)**
* Salva o refresh no banco

---

### 📄 **Controller — Complemento**

```javascript
const jwt = require('jsonwebtoken');

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
};

module.exports = { register, login };
```

---

## 🔐 **3. Middleware de Autenticação (`/src/middlewares/authMiddleware.js`)**

```javascript
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authenticate;
```

---

## 🔒 **4. Rota Protegida só pra testar (`/src/controllers/privateController.js`)**

```javascript
const privateRoute = (req, res) => {
  res.json({ message: `Bem-vindo, usuário ID ${req.user.id} e email ${req.user.email}` });
};

module.exports = { privateRoute };
```

---

## 🛣️ **5. Definindo as rotas (`/src/routes/authRoutes.js`)**

```javascript
const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { privateRoute } = require('../controllers/privateController');
const authenticate = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rota protegida
router.get('/private', authenticate, privateRoute);

module.exports = router;
```

---

## 🚀 **6. Ponto de entrada (`/src/server.js`)**

```javascript
require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');

app.use(express.json());

// Rotas
app.use('/api', authRoutes);

// Banco conectado
sequelize.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('🚀 Server rodando na porta 3000');
    });
  })
  .catch(err => console.error('Erro ao conectar no banco:', err));
```

---

## 📜 **Testa no Insomnia, Postman ou Thunder Client**

* **POST /api/register**

```json
{
  "email": "marcos@email.com",
  "password": "123456"
}
```

* **POST /api/login**
  → Retorna access e refresh token

* **GET /api/private**
  → Header:
  `Authorization: Bearer {access_token}`
  → Retorna mensagem com seu id e email

---

## 🔁 **7. Refresh Token e Logout (Depois)**

Se quiser, agora seguimos com:

* 🔄 **Refresh Token** — gerar novo Access Token
* 🚪 **Logout** — remover refresh do banco

---

## 🏆 **Mano, até aqui você já fez um backend de login digno de produção!**

🗣️ Marcos, me responde:
**Quer fazer já o refresh e logout ou bora fazer o front pra testar isso na prática?**

👉 **Manda que aqui não tem enrolação, só código de qualidade!**
