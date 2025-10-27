USE DEV_RTS_IntegraX;

-- CRIAÇÃO DE VIEWS
-- VIEWS PARA TICKETS COMPLETOS
CREATE VIEW
    vw_tickets_completo AS
SELECT
    Tickets.id as id_ticket,
    Tickets.title as title_ticket,
    Tickets.description as description_ticket,
    Tickets.data_criacao as data_criacao_ticket,
    Tickets.atualizado_em as data_atualizacao_ticket,
    Tickets.data_encerramento as data_encerramento_ticket,
    Status.nome as status,
    Status.cor as cor_Status,
    Tickets.prioridade as prioriedade_ticket,
    Grupo.nome as Grupo,
    Grupo.cor as cor_Grupo,
    Tickets.solicitante_id as id_pessoa,
    Pessoa.nome_exibicao as nome_pessoa,
    Tickets.url_github as url_repositorio,
    GH.github_id,
    GH.tipo as tipo_github,
    GH.titulo as titulo_github,
    GH.status as status_github,
    GH.url as url_github
FROM
    TK_tickets Tickets
    LEFT JOIN GH_integracao GH ON GH.ticket_id = Tickets.id
    LEFT JOIN RTS_status Status ON Status.id = Tickets.status_id
    LEFT JOIN RTS_grupo Grupo ON Grupo.id = Tickets.grupo_id
    LEFT JOIN RTS_pessoa Pessoa ON Pessoa.id = Tickets.solicitante_id;

-- CRIAÇÃO DE VIEWS PARA TICKETS SIMPLES
CREATE VIEW
    vw_tickets_simples AS
SELECT
    Tickets.id as "ID",
    Tickets.title as "Titulo",
    Status.nome as "Status",
    Status.cor as "Cor_Status",
    Grupo.nome as "Grupo",
    Grupo.cor as "Cor_Grupo",
    Tickets.prioridade as "Prioriedade",
    Tickets.description as "Descricao"
FROM
    TK_tickets Tickets
    JOIN RTS_status Status ON Status.id = Tickets.status_id
    JOIN RTS_grupo Grupo ON Grupo.id = Tickets.grupo_id;

-- CRIAÇÃO DE VIEWS PARA STATUS
CREATE VIEW
    vw_status_simples AS
SELECT
    Status.nome AS id_nome,
    Status.id AS id_status,
    Banco.nome AS nome_Banco,
    Tabela.nome AS nome_tabela
FROM
    RTS_status Status
    LEFT JOIN RTS_tipoBanco Banco on Status.tipoBanco_id = Banco.id
    LEFT JOIN RTS_tabela Tabela on Status.tabela_id = Tabela.id;

-- CRIAÇÃO DE VIEWS PARA GRUPOS
CREATE VIEW
    vw_grupo_simples AS
SELECT
    Grupo.id AS Grupo_id,
    Grupo.nome AS Grupo_nome,
    Banco.nome AS Banco_nome
FROM
    RTS_grupo Grupo
    LEFT JOIN RTS_tipoBanco Banco on Grupo.tipoBanco_id = Banco.id;

-- CRIAÇÃO DE VIEWS PARA PESSOAS SIMPLES
CREATE VIEW
    vw_pessoa_simples AS
SELECT
    pessoa.id as pessoa_id,
    pessoa.nome as pessoa_nome,
    pessoa.nome_exibicao as pessoa_apelido,
    usuario.id as usuario_id,
    usuario.usuario as usuario_nome,
    usuario.email as usuario_email,
    usuario.tipo as usuario_tipo
FROM
    RTS_pessoa pessoa
    LEFT JOIN RTS_usuario usuario ON usuario.id = pessoa.usuario_id;

-- CRIAÇÃO DE VIEWS PARA PESSOAS EMPRESA
CREATE VIEW
    vw_pessoa_empresa AS
SELECT
    pessoa.id as pessoa_id,
    pessoa.nome as pessoa_nome,
    pessoa.nome_exibicao as pessoa_apelido,
    usuario.id as usuario_id,
    usuario.usuario as usuario_nome,
    usuario.email as usuario_email,
    usuario.tipo as usuario_tipo,
    empresa.nome_fantasia as empresa_nome,
    vinculo.cargo as vinculo_cargo
FROM
    RTS_pessoa pessoa
    LEFT JOIN RTS_usuario usuario ON usuario.id = pessoa.usuario_id
    LEFT JOIN RTS_pessoa_vinculo vinculo ON vinculo.pessoa_id = pessoa.id
    LEFT JOIN RTS_empresa empresa ON empresa.id = vinculo.empresa_id