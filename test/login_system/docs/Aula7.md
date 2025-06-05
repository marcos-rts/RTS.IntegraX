💥 AGORA SIM, MARCOS! Bora finalizar isso na tora, bonitão, redondinho e do jeito certo. Depois a gente já mete marcha no front. Bora sem enrolação, mas com clareza de professor chato que explica tudo!

---

# 🔥 **1. Refresh Token — Endpoint `/api/refresh`**

### 👉 **Por que precisa?**

O `accessToken` expira rápido (tipo 15 minutos), então o `refreshToken` serve pra gerar um novo `accessToken` sem precisar logar de novo.

---

### 🚩 **Rota Refresh Token (`POST /api/refresh`)**

```javascript
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Token de atualização ausente' });
    }

    try {
        // Procura o refresh no banco
        const user = await User.findOne({ where: { refreshToken } });

        if (!user) {
            return res.status(403).json({ message: 'Refresh token inválido' });
        }

        // Valida o refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err || user.email !== decoded.email) {
                return res.status(403).json({ message: 'Refresh token inválido' });
            }

            // Gera novo access token
            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken });
        });
    } catch (error) {
        console.error('Erro no refresh:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
};
```

---

# 🔴 **2. Logout — Endpoint `/api/logout`**

### 👉 **Por que precisa?**

Pra invalidar o `refreshToken` do usuário no banco. Assim, se alguém roubar o refresh, já era… não consegue gerar token novo.

---

### 🚩 **Rota Logout (`POST /api/logout`)**

```javascript
const logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.sendStatus(204); // Sem conteúdo
    }

    try {
        const user = await User.findOne({ where: { refreshToken } });

        if (!user) {
            return res.sendStatus(204); // Mesmo se não achou, responde igual (pra segurança)
        }

        // Remove o refresh token do banco
        user.refreshToken = null;
        await user.save();

        res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
        console.error('Erro no logout:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
};
```

---

# 🧠 **3. Middleware — Proteger Rotas**

### 👉 **Se não tiver isso, qualquer um acessa suas rotas privadas!**

---

### 🚩 **`authMiddleware.js`**

```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido ou expirado' });

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
```

---

### ✅ **Exemplo de rota protegida:**

```javascript
const authenticateToken = require('./middlewares/authMiddleware');

app.get('/api/protegida', authenticateToken, (req, res) => {
    res.json({ message: `Bem-vindo ${req.user.email}, você acessou uma rota protegida!` });
});
```

---

# 🗺️ **Fluxo Completo do Login**

```plaintext
[LOGIN] --> /api/login --> Recebe accessToken + refreshToken
    |
    |---> Usa accessToken para acessar rotas protegidas (válido por 15min)
    |
    |---> accessToken expirou? --> /api/refresh --> Recebe novo accessToken
    |
    |---> /api/logout --> Invalida refreshToken no banco (encerra sessão)
```

---

# 📜 **Arquivo de Rotas — Exemplo básico organizado**

```javascript
const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Exemplo de rota protegida
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: `Perfil do usuário ${req.user.email}` });
});

module.exports = router;
```

---

# ⚙️ **No `app.js`:**

```javascript
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
```

---

# 🔥🔥🔥 **BACKEND FINALIZADO!** 🔥🔥🔥

✅ Seguro
✅ Funcional
✅ Profissional

---

# 🚀 **Agora bora pro Frontend, parceiro!**

Quer fazer ele com **HTML + Fetch básico**, ou já partir pra algo mais sinistro tipo **React**, **Vue**, ou **Next.js**?

👉 Manda na lata que eu te acompanho até o fim nessa! Bora ser brabo! 💪
