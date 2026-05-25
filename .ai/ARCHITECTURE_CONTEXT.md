# RTS.IntegraX — Architecture Context

# Stack atual

Backend:
- Node.js
- Express
- MySQL
- JWT Authentication

Frontend:
- HTML
- Bootstrap
- JavaScript Vanilla

---

# Estrutura principal

RTS_*:
núcleo do sistema

Módulos:
- auth
- tickets
- users
- people
- audit
- github
- financeiro
- controle de itens

---

# Estratégia futura

Backend:
- migração gradual para TypeScript

Frontend:
- migração gradual para React + Vite + TypeScript

---

# Filosofia arquitetural

O sistema deve funcionar como uma plataforma modular.

Toda funcionalidade nova deve:
- respeitar modularização
- evitar acoplamento excessivo
- reutilizar componentes existentes
- manter rastreabilidade

---

# Prioridades atuais

1. estabilizar backend
2. corrigir bugs críticos
3. melhorar segurança
4. organizar estrutura
5. iniciar TypeScript