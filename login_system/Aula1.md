Perfeito, Marcos! Bora aprender *de vez* a criar um sistema de login em JavaScript, do jeito certo — com organização, rotas, boas práticas, e te explicando **cada** parte como um professor que quer ver o aluno voando.

Vamos fazer isso **por partes**, para que você **realmente entenda tudo**. A ideia aqui não é correr e terminar, mas te dar domínio.

---

## 👨‍🏫 Etapa 1: Entendimento do que vamos criar

### 🎯 Objetivo

Criar um sistema de login em JavaScript com:

* Estrutura separada (padrão MVC simplificado)
* Rotas (usando Express)
* Middleware de autenticação
* Armazenamento de usuários (pode começar em memória, depois vamos pro banco)
* Hash de senha (bcrypt)
* Sessão com JWT (token)

---

## 🧱 Estrutura do projeto

```bash
login-system/
├── controllers/
│   └── authController.js
├── models/
│   └── userModel.js
├── routes/
│   └── authRoutes.js
├── middlewares/
│   └── authMiddleware.js
├── utils/
│   └── token.js
├── app.js
├── package.json
```

A estrutura é separada porque:

* **controllers**: lidam com a lógica (ex: login, cadastro)
* **models**: lidam com os dados (simulando banco no início)
* **routes**: define as rotas da aplicação
* **middlewares**: verificações no meio do caminho (como autenticação)
* **utils**: funções auxiliares (gerar tokens, etc)
* **app.js**: onde a aplicação é montada

---

## 💿 Etapa 2: Setup Inicial

### 1. Cria uma pasta e inicializa o projeto

```bash
mkdir login-system
cd login-system
npm init -y
```

### 2. Instala as dependências

```bash
npm install express bcrypt jsonwebtoken dotenv
npm install nodemon --save-dev
```

Explicando:

* `express`: o servidor web
* `bcrypt`: para criptografar senhas
* `jsonwebtoken`: para gerar e validar tokens de autenticação
* `dotenv`: para variáveis de ambiente (tipo segredos)
* `nodemon`: recarrega o servidor automaticamente no desenvolvimento

### 3. Configura o `package.json` para rodar com `nodemon`

```json
"scripts": {
  "dev": "nodemon app.js"
}
```

---

## 🚀 Etapa 3: Começando com o servidor

### `app.js`

```js
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes); // todas as rotas de autenticação

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
```

---

## ✍️ Sua missão agora:

1. Crie essa estrutura de pastas.
2. Instale os pacotes que te falei.
3. Crie o arquivo `app.js` com esse código.
4. Me avise aqui assim que isso estiver pronto, e a gente vai construir **o back-end de login de forma 100% explicada e justificada**.

---

Se em algum ponto quiser pausar pra entender o porquê de alguma coisa, **manda ver**. Aqui a ideia é te formar pra não depender de tutorial meia-boca.

Quer seguir?
