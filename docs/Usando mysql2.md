# 📦 MySQL2 com Node.js – Tutorial Rápido

Este exemplo mostra como usar o driver **mysql2** de forma **nativa**, sem ORM, com Node.js para executar operações básicas (CRUD).

## 📁 Estrutura

```bash
.
├── db.js         # Conexão com o MySQL
├── usuario.js    # Funções de CRUD
└── index.js      # Execução das funções
```

---

## 🚀 Pré-requisitos

* Node.js instalado
* MySQL rodando localmente
* Banco de dados chamado `teste`
* Tabela `usuarios` criada com a seguinte estrutura:

```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100)
);
```

---

## 🧩 Instalação

```bash
npm init -y
npm install mysql2
```

---

## 🔌 1. Conexão com MySQL (`db.js`)

```js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha',
  database: 'teste'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

module.exports = connection;
```

---

## 🛠 2. CRUD de Usuários (`usuario.js`)

```js
const db = require('./db');

// Listar todos
function listarUsuarios() {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return console.error('Erro ao listar:', err);
    console.table(results);
  });
}

// Criar novo
function criarUsuario(nome, email) {
  const usuario = { nome, email };
  db.query('INSERT INTO usuarios SET ?', usuario, (err, result) => {
    if (err) return console.error('Erro ao inserir:', err);
    console.log('ID do novo usuario:', result.insertId);
  });
}

// Atualizar nome pelo ID
function atualizarUsuario(id, nome) {
  db.query('UPDATE usuarios SET nome = ? WHERE id = ?', [nome, id], (err, result) => {
    if (err) return console.error('Erro ao atualizar:', err);
    console.log('Linhas afetadas:', result.affectedRows);
  });
}

// Remover por ID
function removerUsuario(id) {
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
    if (err) return console.error('Erro ao remover:', err);
    console.log('Usuário removido com sucesso!');
  });
}

module.exports = {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  removerUsuario
};
```

---

## 📍 3. Execução dos Comandos (`index.js`)

```js
const usuario = require('./usuario');

// Cria um usuário
usuario.criarUsuario('Marcos', 'marcos@email.com');

// Lista todos os usuários
usuario.listarUsuarios();

// Atualiza o nome do usuário com id = 1
usuario.atualizarUsuario(1, 'Marcos Atualizado');

// Remove o usuário com id = 1
usuario.removerUsuario(1);
```

---

## ✅ Resultado esperado no console

```
Conectado ao MySQL!
┌─────────┬────┬────────────┬───────────────────────┐
│ (index) │ id │   nome     │        email          │
├─────────┼────┼────────────┼───────────────────────┤
│    0    │ 1  │  Marcos    │ marcos@email.com      │
└─────────┴────┴────────────┴───────────────────────┘
```

---

## 🧠 Dicas

* Você pode usar `mysql2/promise` para utilizar async/await.
* Evite SQL Injection usando parâmetros com `?`, como nos exemplos.
* Sempre trate erros de forma robusta em produção.

---

Se quiser, posso converter esse conteúdo em um `.md` diretamente no seu projeto. Deseja?
