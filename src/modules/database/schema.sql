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
  tipo ENUM('Credito', 'Debito'),
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