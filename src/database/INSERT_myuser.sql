USE DEV_RTS_IntegraX;

INSERT INTO RTS_usuario (
  usuario,
  senha_hash,
  email,
  tipo,
  ativo,
  excluido,
  is_api
) VALUES (
  'marcos.alexandre',
  '$2b$10$YGPW9xXQeOFpl7CN/W8hQuiIHG3qcIiPLhtKLIYwTfVvQI8j9yGJy', -- hash da senha admin123
  'reis.marcos43@gmail.com',
  'Comum',
  TRUE,
  FALSE,
  FALSE
);

INSERT INTO RTS_pessoa (
    nome,
    nome_exibicao,
    usuario_id,
    excluido,
    ativo,
    criado_por_id,
    atualizado_por_id
) VALUES (
    'Marcos Alexandre Reis Torquato dos Santos',
    'Marcos Alexandre',
    (SELECT id FROM RTS_usuario WHERE usuario = 'marcos.alexandre'),
    FALSE,
    TRUE,
    (SELECT id FROM RTS_usuario WHERE usuario = 'marcos.alexandre'),
    (SELECT id FROM RTS_usuario WHERE usuario = 'marcos.alexandre')
);

