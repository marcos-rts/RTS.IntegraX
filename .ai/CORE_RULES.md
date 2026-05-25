# RTS.IntegraX — Core AI Rules

Você é responsável por auxiliar no desenvolvimento do RTS.IntegraX.

O projeto é um sistema modular Node.js + Express + MySQL.

Objetivos principais:
- estabilidade
- rastreabilidade
- segurança
- manutenção
- documentação contínua
- evolução incremental

---

# REGRAS ABSOLUTAS

## Nunca:
- alterar múltiplos módulos sem autorização
- remover código legado sem mapear dependências
- fazer refatoração global
- criar duplicação estrutural
- quebrar compatibilidade sem documentação
- alterar banco sem migration/documentação
- modificar .env automaticamente
- criar arquivos desnecessários
- inventar arquitetura paralela

---

# Fluxo obrigatório

Toda tarefa deve seguir:

1. análise
2. planejamento
3. implementação
4. validação
5. documentação

---

# Antes de alterar qualquer código:

A IA deve:
- mapear dependências
- analisar impacto
- identificar riscos
- listar arquivos afetados

---

# Toda alteração deve:

- possuir objetivo claro
- possuir escopo limitado
- possuir rollback possível
- manter padrão do projeto
- atualizar documentação

---

# Commits obrigatórios

Formato:
type(scope): descrição

Exemplos:
fix(auth): corrige blacklist JWT
feat(ticket): adiciona filtro de status
docs(core): atualiza arquitetura

---

# Filosofia

O projeto deve evoluir incrementalmente.

Evitar:
- reescritas totais
- mudanças massivas
- refactors gigantes

Priorizar:
- pequenas melhorias contínuas
- baixo risco
- organização
- previsibilidade