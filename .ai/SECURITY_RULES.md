# RTS.IntegraX — Security Rules

# Nunca:

- expor tokens
- salvar senha sem hash
- criar rota sem middleware
- confiar em input do frontend
- retornar erro interno ao cliente

---

# JWT

- validar expiração
- validar blacklist
- proteger rotas privadas

---

# Banco

- sempre usar parâmetros
- evitar concatenação SQL

---

# Logs

- nunca logar senha
- nunca logar token
- nunca logar segredo de ambiente