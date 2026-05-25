# RTS.IntegraX — Coding Standards

# Backend

- usar async/await
- evitar callbacks antigos
- tratar erros corretamente
- nunca deixar console.log temporário
- evitar lógica duplicada
- separar controller/service/repository quando possível

---

# Nomeação

Rotas:
ticket.route.js

Controllers:
ticket.controller.js

Services:
ticket.service.js

Repositories:
ticket.repository.js

---

# Banco

- nunca usar SELECT *
- sempre nomear colunas explicitamente
- usar prefixos oficiais do projeto
- documentar migrations

---

# Segurança

- validar inputs
- nunca confiar no frontend
- nunca retornar stack trace
- proteger rotas administrativas

---

# Frontend

- evitar JS inline
- reutilizar componentes
- separar responsabilidades
- evitar lógica complexa em HTML