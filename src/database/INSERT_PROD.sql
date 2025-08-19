-- INSEREÇÃO DE DADOS INICIAIS
-- Inserção de usuário admin
-- A senha 'admin' foi convertida para hash usando bcrypt
INSERT INTO
    RTS_usuario (
        usuario,
        senha_hash,
        email,
        tipo,
        ativo,
        excluido,
        is_api
    )
VALUES
    (
        'admin',
        '$2b$10$YGPW9xXQeOFpl7CN/W8hQuiIHG3qcIiPLhtKLIYwTfVvQI8j9yGJy', -- hash da senha admin123
        'admin@exemplo.com',
        'Admin',
        TRUE,
        FALSE,
        FALSE
    );

-- Inserção de marcadores
INSERT INTO
    RTS_marcador (
        nome,
        descricao,
        cor,
        ativo,
        excluido,
        criado_por_id
    )
VALUES
    (
        'NetTurbo',
        'Marcador associados a empresa NetTurbo',
        '#00c900ff',
        TRUE,
        FALSE,
        1
    );

-- Inserção de tipos de banco
INSERT INTO
    RTS_tipoBanco (nome, descricao, ativo, excluido, criado_por_id)
VALUES
    ('RTS', 'Core do sistema', TRUE, FALSE, 1), -- ID: 1
    ('CT', 'Controle de Itens', TRUE, FALSE, 1), -- ID: 2
    ('FX', 'Finanças e Contabilidade', TRUE, FALSE, 1), -- ID: 3
    ('TK', 'Tickets de Suporte', TRUE, FALSE, 1);

-- ID: 4
-- Inserção de tabela RTS_tabela
INSERT INTO
    RTS_tabela (
        nome,
        descricao,
        tipoBanco_id,
        ativo,
        excluido,
        criado_por_id
    )
VALUES
    (
        'FX_conta',
        'Tabela com informações das contas digitais',
        3,
        TRUE,
        FALSE,
        1
    ),
    (
        'FX_transacao',
        'Tabela com informações das transações financeiras',
        3,
        TRUE,
        FALSE,
        1
    );

-- Inserção de status para Controle de Itens (CT)
INSERT INTO
    RTS_status (
        nome,
        descricao,
        tipoBanco_id,
        cor,
        ativo,
        excluido,
        criado_por_id
    )
VALUES
    (
        'Disponível',
        'Status disponível',
        2,
        '#D4EDDA',
        TRUE,
        FALSE,
        1
    ),
    (
        'Em uso',
        'Status em uso',
        2,
        '#CCE5FF',
        TRUE,
        FALSE,
        1
    ),
    (
        'Manutenção',
        'Status Manutenção',
        2,
        '#FFF3CD',
        TRUE,
        FALSE,
        1
    ),
    (
        'Descartado',
        'Status descartado',
        2,
        '#F8D7DA',
        TRUE,
        FALSE,
        1
    );

-- Inserção de status para Tickets (TK)
INSERT INTO
    RTS_status (
        nome,
        descricao,
        tipoBanco_id,
        cor,
        ativo,
        excluido,
        criado_por_id
    )
VALUES
    (
        'Aberto',
        'Ticket aberto',
        4,
        '#009122ff',
        TRUE,
        FALSE,
        1
    ),
    (
        'Em andamento',
        'Ticket em andamento',
        4,
        '#0e6cd1ff',
        TRUE,
        FALSE,
        1
    ),
    (
        'Fechado',
        'Ticket fechado',
        4,
        '#000000ff',
        TRUE,
        FALSE,
        1
    ),
    (
        'Cancelado',
        'Ticket cancelado',
        4,
        '#420006ff',
        TRUE,
        FALSE,
        1
    );

-- Inserção de status para conta digitais (FX)
INSERT INTO
    RTS_status (
        nome,
        descricao,
        tipoBanco_id,
        tabela_id,
        cor,
        ativo,
        excluido,
        criado_por_id
    )
VALUES
    (
        'Em Uso',
        'Banco usado no dia a dia',
        3,
        1,
        '#D4EDDA',
        TRUE,
        FALSE,
        1
    ),
    (
        'Poupança',
        'Banco usado para poupança',
        3,
        1,
        '#CCE5FF',
        TRUE,
        FALSE,
        1
    ),
    (
        'Investimentos',
        'Banco usado para investimentos',
        3,
        1,
        '#FFF3CD',
        TRUE,
        FALSE,
        1
    ),
    (
        'Verificando',
        'Banco em verificação',
        3,
        1,
        '#F8D7DA',
        TRUE,
        FALSE,
        1
    ),
    (
        'Congelado',
        'Banco congelado',
        3,
        1,
        '#F8D7DA',
        TRUE,
        FALSE,
        1
    );

-- Inserção de status para Finanças (FX)
INSERT INTO
    RTS_status (
        nome,
        descricao,
        tipoBanco_id,
        tabela_id,
        cor,
        ativo,
        excluido,
        criado_por_id
    )
VALUES
    (
        'Pendente',
        'Transação pendente',
        3,
        2,
        '#D4EDDA',
        TRUE,
        FALSE,
        1
    ),
    (
        'Confirmado',
        'Transação confirmada',
        3,
        2,
        '#F8D7DA',
        TRUE,
        FALSE,
        1
    ),
    (
        'Cancelado',
        'Transação cancelada',
        3,
        2,
        '#CCE5FF',
        TRUE,
        FALSE,
        1
    );

-- Inserção de Grupos (TK)
INSERT INTO
    RTS_grupo (
        nome,
        descricao,
        exemplo,
        cor,
        tipoBanco_id,
        ativo,
        excluido,
        criado_por_id
    )
VALUES
    (
        'Incidente/Bug',
        'Algo que quebrou, precisa correção imediata.',
        '"Erro 500 na tela de login", "Sistema não salva dados"',
        '#FF0000',
        (
            SELECT
                id
            FROM
                RTS_tipoBanco
            WHERE
                nome = 'TK'
        ),
        TRUE,
        FALSE,
        1
    ),
    (
        'Requisição',
        'Pedido de serviço novo, mas não é bug nem melhoria.',
        '"Criar novo usuário", "Instalar ferramenta X"',
        '#d4c600ff',
        (
            SELECT
                id
            FROM
                RTS_tipoBanco
            WHERE
                nome = 'TK'
        ),
        TRUE,
        FALSE,
        1
    ),
    (
        'Melhoria',
        'Algo que já existe mas pode ser otimizado.',
        '"Aumentar performance da API", "Melhorar layout de tela"',
        '#00eb89ff',
        (
            SELECT
                id
            FROM
                RTS_tipoBanco
            WHERE
                nome = 'TK'
        ),
        TRUE,
        FALSE,
        1
    ),
    (
        'Projeto',
        'Demanda maior, com entregas em fases ou várias tarefas relacionadas.',
        '"Implantar nova API", "Refatoração geral do módulo Y"',
        '#690931ff',
        (
            SELECT
                id
            FROM
                RTS_tipoBanco
            WHERE
                nome = 'TK'
        ),
        TRUE,
        FALSE,
        1
    ),
    (
        'Tarefa Interna',
        'Tarefas administrativas ou rotinas operacionais.',
        '"Backup semanal", "Organizar documentação"',
        '#00c1f1ff',
        (
            SELECT
                id
            FROM
                RTS_tipoBanco
            WHERE
                nome = 'TK'
        ),
        TRUE,
        FALSE,
        1
    ),
    (
        'Demanda Externa',
        'Algo vindo de cliente, fornecedor ou outro time.',
        '"Solicitação do time financeiro", "Cliente pediu ajuste"',
        '#ef3fffff',
        (
            SELECT
                id
            FROM
                RTS_tipoBanco
            WHERE
                nome = 'TK'
        ),
        TRUE,
        FALSE,
        1
    ),
    (
        'Teste',
        'Atividades de QA, homologações e validações.',
        '"Testar novo deploy", "Homologar nova versão do app"',
        '#000000ff',
        (
            SELECT
                id
            FROM
                RTS_tipoBanco
            WHERE
                nome = 'TK'
        ),
        TRUE,
        FALSE,
        1
    ),
    (
        'Planejamento',
        'Ticket criado para registrar ações de análise, arquitetura, decisões.',
        '"Definir arquitetura do projeto Z", "Criar roadmap 2025"',
        '#efff5fff',
        (
            SELECT
                id
            FROM
                RTS_tipoBanco
            WHERE
                nome = 'TK'
        ),
        TRUE,
        FALSE,
        1
    );