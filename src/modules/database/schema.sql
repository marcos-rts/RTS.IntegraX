-- Criação do esquema completo baseado no DBML original
-- Autor: Marcos
-- Banco de Dados: Test_RTS_IntegraX
-- Data de criação: 2025-06-05
-- Data de atualização: 2025-06-10
-- Descrição: Script para criação do banco de dados Test_RTS_IntegraX com todas as tabelas e relacionamentos necessários.
-- Este script deve ser executado em um ambiente MySQL compatível.

DROP DATABASE IF EXISTS Test_RTS_IntegraX;
CREATE DATABASE Test_RTS_IntegraX;
USE Test_RTS_IntegraX;


-- Tabela: RTS_usuario
CREATE TABLE RTS_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(255),
  senha_hash VARCHAR(255),
  email VARCHAR(255),
  tipo ENUM('Admin', 'Comum'),
  celular_2fa VARCHAR(255),
  data_login TIMESTAMP NULL,
  data_logout TIMESTAMP NULL,
  token VARCHAR(255),
  data_token TIMESTAMP NULL,
  is_api BOOLEAN DEFAULT FALSE,
  excluido BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id)
);

-- Tabela: RTS_tipoBanco
CREATE TABLE RTS_tipoBanco (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  descricao TEXT,
  excluido BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id)
);

-- Tabela: RTS_status
CREATE TABLE RTS_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  descricao TEXT,
  -- tipo ENUM('CT', 'RTS', 'FX', 'TK'),
  tipoBanco_id INT,
  cor VARCHAR(7) DEFAULT '#FFFFFF',
  excluido BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (tipoBanco_id) REFERENCES RTS_tipoBanco(id)
);

-- Tabela: RTS_pessoa
CREATE TABLE RTS_pessoa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  nome_exibicao VARCHAR(255),
  usuario_id INT,
  excluido BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (usuario_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id)
);

-- Tabela: RTS_grupo
CREATE TABLE RTS_grupo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  descricao TEXT,
  tipoBanco_id INT,
  excluido BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (tipoBanco_id) REFERENCES RTS_tipoBanco(id),
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id)
);

-- Tabela: RTS_auditoria
CREATE TABLE RTS_auditoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tabela VARCHAR(255),
  id_registro INT,
  acao ENUM('CRIAR', 'EDITAR', 'EXCLUIR', 'ATIVAR', 'INATIVAR'),
  antes TEXT,
  depos TEXT,
  feito_por_id INT,
  feito_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (feito_por_id) REFERENCES RTS_usuario(id)
);

-- Tabela: CT_itens
CREATE TABLE CT_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  descricao TEXT,
  status_id INT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  observacao TEXT,
  excluido BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (status_id) REFERENCES RTS_status(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id)
);

CREATE TABLE TK_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  status_id INT,
  prioridade ENUM('Baixa', 'Média', 'Alta', 'Urgente') DEFAULT 'Média',
  solicitante_id INT,
  excluido BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (status_id) REFERENCES RTS_status(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (solicitante_id) REFERENCES RTS_pessoa(id),
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id)
);

-- Tabela: FX_conta
CREATE TABLE FX_conta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  valor DECIMAL(10,2) DEFAULT 0.0,
  descricao TEXT,
  excluido BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  tipo ENUM('Credito', 'Debito') DEFAULT 'Debito',
  status_id INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (status_id) REFERENCES RTS_status(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id)
);

CREATE TABLE FX_subconta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conta_id INT NOT NULL, -- vínculo com FX_conta
  nome VARCHAR(255),
  valor DECIMAL(10,2) DEFAULT 0.0,
  tipo ENUM('Cofrinho', 'Investimento', 'Reserva', 'Outros') DEFAULT 'Cofrinho',
  descricao TEXT,
  excluido BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (conta_id) REFERENCES FX_conta(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id)
);


-- Tabela: FX_categoria
CREATE TABLE FX_categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  descricao TEXT,
  excluido BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id)
);

-- Tabela: FX_subcategoria
CREATE TABLE FX_subcategoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  categoria_id INT,
  descricao TEXT,
  excluido BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (categoria_id) REFERENCES FX_categoria(id),
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id)
);

CREATE TABLE FX_transacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  valor DECIMAL(10,2) NOT NULL,
  tipo ENUM('Entrada', 'Saída', 'Transferência') NOT NULL DEFAULT 'Saída',
  informacao TEXT,
  conta_id INT NOT NULL, -- vínculo com FX_conta
  conta_2_id INT NULL, -- opcional, pode ser NULL se não for movimentação segmentada
  subcategoria_id INT NULL, -- vínculo com FX_subcategoria
  pessoa_id INT NULL, -- vínculo com RTS_pessoa (quem esta associado)
  observacao TEXT,
  status_id INT, -- vínculo com RTS_status
  data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  excluido BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por_id INT,
  atualizado_por_id INT,
  FOREIGN KEY (conta_id) REFERENCES FX_conta(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (conta_2_id) REFERENCES FX_conta(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (subcategoria_id) REFERENCES FX_subcategoria(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (pessoa_id) REFERENCES RTS_pessoa(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (status_id) REFERENCES RTS_status(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (criado_por_id) REFERENCES RTS_usuario(id),
  FOREIGN KEY (atualizado_por_id) REFERENCES RTS_usuario(id)
);

-- INSEREÇÃO DE DADOS INICIAIS

-- Inserção de usuário admin
-- A senha 'admin' foi convertida para hash usando bcrypt
INSERT INTO RTS_usuario (
  usuario,
  senha_hash,
  email,
  tipo,
  ativo,
  excluido,
  is_api
) VALUES (
  'admin',
  '$2b$10$YGPW9xXQeOFpl7CN/W8hQuiIHG3qcIiPLhtKLIYwTfVvQI8j9yGJy', -- hash da senha admin123
  'admin@exemplo.com',
  'Admin',
  TRUE,
  FALSE,
  FALSE
);

-- Inserção de tipos de banco
INSERT INTO RTS_tipoBanco (nome, descricao, ativo, excluido, criado_por_id) VALUES
('RTS', 'Core do sistema', TRUE, FALSE, 1),
('CT', 'Controle de Itens', TRUE, FALSE, 1),
('FX', 'Finanças e Contabilidade', TRUE, FALSE, 1),
('TK', 'Tickets de Suporte', TRUE, FALSE, 1);

-- Inserção de status para Controle de Itens (CT)
INSERT INTO RTS_status (nome, descricao, tipoBanco_id, cor, ativo, excluido, criado_por_id) VALUES
('Disponível', 'Status disponível', 2, '#D4EDDA', TRUE, FALSE, 1),
('Em uso', 'Status em uso', 2, '#CCE5FF', TRUE, FALSE, 1),
('Manutenção', 'Status Manutenção', 2, '#FFF3CD', TRUE, FALSE, 1),
('Descartado', 'Status descartado', 2, '#F8D7DA', TRUE, FALSE, 1);

-- Inserção de status para Tickets (TK)
INSERT INTO RTS_status (nome, descricao, tipoBanco_id, cor, ativo, excluido, criado_por_id) VALUES
('Aberto', 'Ticket aberto', 4, '#D4EDDA', TRUE, FALSE, 1),
('Em andamento', 'Ticket em andamento', 4, '#CCE5FF', TRUE, FALSE, 1),
('Fechado', 'Ticket fechado', 4, '#FFF3CD', TRUE, FALSE, 1),
('Cancelado', 'Ticket cancelado', 4, '#F8D7DA', TRUE, FALSE, 1);

INSERT INTO RTS_status (nome, descricao, tipoBanco_id, cor, ativo, excluido, criado_por_id) VALUES
('Em Uso', 'Banco usado no dia a dia', 3, '#D4EDDA', TRUE, FALSE, 1),
('Poupança', 'Banco usado para poupança', 3, '#CCE5FF', TRUE, FALSE, 1),
('Investimentos', 'Banco usado para investimentos', 3, '#FFF3CD', TRUE, FALSE, 1),
('Verificando', 'Banco em verificação', 3, '#F8D7DA', TRUE, FALSE, 1),
('Congelado', 'Banco congelado', 3, '#F8D7DA', TRUE, FALSE, 1);
