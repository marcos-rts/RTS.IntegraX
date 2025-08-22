# RTS.IntegraX

Um sistema modular para gestão e integração de processos internos.  
O projeto nasceu para organizar fluxos como **controle de itens, finanças, tickets e auditoria**, mas pode crescer para abranger outros módulos conforme a necessidade.

## 🚀 Tecnologias

- **Backend:** Node.js + Express  
- **Banco de Dados:** MySQL  
- **Frontend:** Bootstrap (HTML/CSS/JS)  
<!-- - **Monitoramento:** Grafana / Zabbix   -->

## 📦 Estrutura do Projeto

- `src/` → Código principal (controllers, rotas, modelos)  
- `public/` → Arquivos estáticos e frontend (Bootstrap)  
- `docs/` → Documentação auxiliar  
- `test/` → Testes  

## ⚙️ Como Rodar Localmente

```bash
# Clonar repositório
git clone https://github.com/marcos-rts/RTS.IntegraX.git

cd RTS.IntegraX

# Instalar dependências
npm install
```

# Configurar variáveis de ambiente (.env)
```.env
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=DEV_RTS_IntegraX
```

# Rodar servidor
```bash
npm start
```

O servidor ficará disponível em `http://localhost:3000`.

## 🗂️ Módulos Atuais

- **CT (Controle de Itens):** Gestão de entrada e saída. *(Em desenvolvimento)*
- **FX (Financeiro):** Controle de transações. *(Não iniciado)*
- **TK (Tickets):** Registro de chamados internos. *(Em desenvolvimento)*
- **Auditoria:** Log completo de ações no sistema.
    

## 🤝 Contribuição

Sinta-se livre para abrir **Issues** ou enviar **Pull Requests**.  
Antes de contribuir, confira as orientações no arquivo [CONTRIBUTING.md](https://github.com/marcos-rts/RTS.IntegraX/blob/main/CONTRIBUTING.md).

## 📜 Changelog

As alterações são registradas no arquivo [CHANGELOG.md](https://github.com/marcos-rts/RTS.IntegraX/blob/main/CHANGELOG.md).

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](https://github.com/marcos-rts/RTS.IntegraX/blob/main/LICENSE) para mais informações.