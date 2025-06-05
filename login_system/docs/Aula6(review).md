Perfeito, Marcos! 🧠🔥 Bora recapitular rapidinho onde a gente tava, só pra garantir que estamos no mesmo compasso.

---

## 🚦 **Ponto onde paramos:**

* ✅ Backend já configurado com Node.js + Express.
* ✅ Estrutura de pastas organizada (`routes`, `controllers`, `models`).
* ✅ Rotas funcionando (`/api/login`, `/api/register`).
* ✅ Servidor rodando redondinho.
* ✅ Conectado ao MySQL usando Sequelize.

O que estava na mesa para começar era justamente **a integração definitiva do sistema de login com o banco de dados.**

## 💡 **Objetivo desta aula:**

* Fazer o sistema de **cadastro (register)** gravar usuários no banco.
* Fazer o **login consultar o banco** para verificar se o usuário existe e se a senha está correta.
* Trabalhar com **criptografia de senha** (bcrypt) — senão, é amadorismo deixar senha em texto puro no banco.
* Retornar respostas adequadas (JSON bonitinho, com sucesso ou erro).

---

## 🔥 Antes, revisa esse fluxograma do processo de login e registro:

### 📈 **Fluxo do Registro (`/api/register`)**

```
Cliente envia username + senha →
  Verifica se username já existe no banco →
    ↳ Se sim → retorna erro "Usuário já existe"
    ↳ Se não → hash da senha (bcrypt) →
            → salva no banco →
            → retorna sucesso "Usuário criado"
```

---

### 📉 **Fluxo do Login (`/api/login`)**

```
Cliente envia username + senha →
  Busca o usuário no banco →
    ↳ Se não acha → retorna erro "Usuário não encontrado"
    ↳ Se acha → compara senha hashada (bcrypt.compare) →
        ↳ Se senha bate → retorna sucesso "Logado"
        ↳ Se senha não bate → retorna erro "Senha incorreta"
```

---

## 🎨 **Desenho do fluxo simplificado:**

```
+----------------+        +-----------------+       +-----------------+
| Cliente (Front) | ----> | Backend (Node.js) | ---> | Banco (MySQL)    |
+----------------+        +-----------------+       +-----------------+
         |                          |                          |
         | -----> /api/register ----> | --> INSERT usuários     |
         | <-- sucesso ou erro <------ | <-- resposta do banco  |
         |                             |                          |
         | -----> /api/login --------> | --> SELECT usuário      |
         | <-- sucesso ou erro <------ | <-- dados do banco      |
```

---

## 🗺️ **Banco de Dados — Tabela `users` (Exemplo)**

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔩 **Dependências que usamos até agora no backend:**

* `express` → servidor web
* `sequelize` → ORM pra MySQL
* `mysql2` → driver do MySQL pro sequelize
* `bcrypt` → hash de senhas
* `nodemon` → desenvolvimento (auto-reload)

---

## 🚀 **Próximos passos na aula (se você confirmar):**

1. 🏗️ **Criar o model `User` no Sequelize.**
2. 🏗️ **Implementar o controller `/register` com verificação e hash da senha.**
3. 🔐 **Implementar o controller `/login` com verificação e comparação de hash.**
4. ⚙️ **(Opcional, se quiser)** → Implementar geração de token (JWT) para autenticação de sessões.

---

## 🎯 Bora partir daqui? Confirma que eu já começo metendo código na lousa, explicando cada detalhe como professor chato que não deixa passar nada! 😎💻

Diz:
👉 “Mete bronca” — que eu disparo a aula agora!
