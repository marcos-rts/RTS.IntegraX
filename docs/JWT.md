Claro, Marcos! Aqui vai a **documentação completa e clara** para adicionar autenticação com JWT no seu sistema Node.js com Express, com suporte a **rotas privadas** e **proteção por token**.

---

# 🛡️ Autenticação com JWT no Node.js (Express)

## 📌 Objetivo

Implementar autenticação segura no sistema utilizando **JWT (JSON Web Token)**, permitindo proteger rotas e controlar o acesso de usuários autenticados.

---

## 📦 Dependências

Instale o pacote `jsonwebtoken`:

```bash
npm install jsonwebtoken
```

---

## 🔐 Variável de ambiente

Adicione no seu `.env`:

```env
JWT_SECRET=umaSenhaUltraSecreta123!
```

---

## 🧪 Login com geração de Token JWT

**Arquivo:** `auth.controller.js` ou equivalente.

```js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../config/database'); // ajuste o caminho conforme seu projeto
const logger = require('../utils/Console_Logger');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM RTS_usuario WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const validaSenha = await bcrypt.compare(password, rows[0].senha_hash);
        if (!validaSenha) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: rows[0].id, email: rows[0].email }, // payload
            process.env.JWT_SECRET, // segredo
            { expiresIn: '2h' } // validade
        );

        logger.Success(`Usuário logado com sucesso: ${email}`);
        return res.status(200).json({
            message: 'Login realizado com sucesso.',
            token
        });

    } catch (error) {
        logger.Error('Erro ao fazer login:', error.message);
        return res.status(500).json({ message: 'Erro ao fazer login.' });
    }
};

module.exports = { login };
```

---

## 🔐 Middleware de Autenticação

**Arquivo:** `middleware/auth.js`

```js
const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido.' });

    const token = authHeader.split(' ')[1]; // formato: "Bearer <token>"

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido ou expirado.' });

        req.usuario = decoded; // payload do token (id, email, etc.)
        next();
    });
};

module.exports = autenticar;
```

---

## 🔒 Rota Privada (exemplo)

**Arquivo:** `itens.route.js` (ou qualquer módulo protegido)

```js
const express = require('express');
const router = express.Router();
const autenticar = require('../../middleware/auth');

router.get('/protegido', autenticar, (req, res) => {
    res.status(200).json({
        message: `Você acessou uma rota protegida!`,
        usuario: req.usuario
    });
});

module.exports = router;
```

---

## 🔧 Integração no `app.js`

```js
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas públicas
const rotasAutenticacao = require('./src/modules/auth/auth.route');
app.use('/api/autenticacao', rotasAutenticacao);

// Rotas privadas
const rotasItens = require('./src/modules/controle_de_itens/itens.route');
app.use('/api/itens', rotasItens);

// Inicialização do servidor
app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
```

---

## 🔁 Fluxo Completo

1. **Login:** Envia e-mail/senha para `POST /api/autenticacao/login`.
2. **Resposta:** Retorna `token JWT`.
3. **Front-end:** Armazena o token (ex: `localStorage`).
4. **Requisições futuras:** Incluem o token no header:

   ```http
   Authorization: Bearer <token>
   ```
5. **Middleware:** Verifica o token antes de acessar as rotas protegidas.
6. **Acesso liberado ou bloqueado.**

---

## ✅ Resultado

Você agora tem:

* Autenticação segura via JWT.
* Rotas privadas acessíveis apenas com token válido.
* Payload no token que pode ser usado para permissões futuras.

---

## 📌 Próximos Passos (opcional)

* ✅ Implementar Refresh Token.
* ✅ Adicionar roles e permissões.
* ✅ Armazenar token no cookie `HttpOnly` (para proteger contra XSS).
* ✅ Logout com blacklist ou token de curta duração.

---

Se quiser, posso gerar esse conteúdo em PDF bonitão com índice, ou gerar um Markdown pra jogar direto no GitHub/Obsidian. Só falar, Marcos!
