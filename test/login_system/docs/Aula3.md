Perfeito, Marcos! Fico **felizaço** que você esteja entendendo — e pode deixar, **explicação não vai faltar aqui!**

Agora bora pro próximo passo, que é uma das coisas mais importantes em qualquer sistema com login:

---

# 🔒 **Protegendo rotas com Middleware de Autenticação**

---

## 🧠 **O que é Middleware?**

> Middleware, no Express, é literalmente algo que fica **“no meio do caminho”** entre a requisição e a resposta.

✔️ Antes de uma rota ser executada, ele pode:

* Checar se o usuário está autenticado
* Fazer logs
* Validar dados
* Entre outras coisas

Se tudo estiver certo, ele chama `next()` e a rota continua. Se não, ele **bloqueia ali mesmo**.

---

## 🎯 **Nosso objetivo agora:**

Criar um middleware que:

* Verifica se o usuário mandou um token JWT válido no cabeçalho
* Se o token for válido, deixa acessar a rota
* Se não for, bloqueia

---

## 📁 Cria o arquivo:

`middlewares/authMiddleware.js`

### 🔥 Código explicado linha por linha:

```js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    // Espera um header assim: "Bearer token_aqui"

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }

        req.user = user; // Injeta os dados do usuário na requisição
        next(); // Segue para a próxima função (a rota)
    });
}

module.exports = authenticateToken;
```

---

## 🧠 **Explicação bruta e clara do que acontece aqui:**

* O middleware busca o token no cabeçalho **Authorization**.

  * O padrão é: `Authorization: Bearer SEU_TOKEN_AQUI`
* Se não existir, já bloqueia (`401 Unauthorized`).
* Se existir, ele tenta decodificar com o segredo (`JWT_SECRET`).
* Se der erro (token inválido ou expirado), bloqueia (`403 Forbidden`).
* Se tudo certo, ele injeta no `req.user` os dados que estavam no token (no nosso caso, o `email`).

---

## 🚀 Vamos testar com uma rota protegida.

### 📁 Cria um arquivo de rota teste:

`routes/privateRoutes.js`

```js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/profile', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Bem-vindo à área protegida!',
        user: req.user // Isso vem do token
    });
});

module.exports = router;
```

---

### ⚙️ E no `app.js`, adiciona:

```js
const privateRoutes = require('./routes/privateRoutes');

app.use('/api/private', privateRoutes);
```

---

## 🔥 Testando:

1️⃣ Faz login → pega o token.

2️⃣ Faz um GET pra:

```
GET /api/private/profile
```

Com esse header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

Se o token for válido:

```json
{
  "message": "Bem-vindo à área protegida!",
  "user": {
    "email": "marcos@example.com",
    "iat": 1723454345,
    "exp": 1723457945
  }
}
```

Se não tiver token ou for inválido:

```json
{
  "message": "Token não fornecido"
}
// ou
{
  "message": "Token inválido"
}
```

---

## 🧠 **Pausa pedagógica aqui:**

➡️ Entendeu certinho como funciona o middleware?
➡️ Sabe agora o que é `401` vs `403`?
➡️ Percebeu o poder do JWT injetando informações no `req.user`?

Se quiser eu te explico mais profundamente como o JWT funciona por dentro, o que são os campos `iat` e `exp`, como ocorre a assinatura, etc.

---

Se tudo fez sentido e tá funcionando, a gente segue pra:

* ✅ Logout com tokens (simulado, porque JWT é stateless)
* ✅ Refresh token (se quiser ir pro avançado)
* ✅ Depois salvar usuários em banco (SQLite, MySQL, Mongo… você escolhe)
* ✅ Estruturar ainda melhor (services, error handling global, validação de dados, etc.)

Bora seguir, professorado tá animado aqui, bora meter ficha! 🔥
