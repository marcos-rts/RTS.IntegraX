/**
 * Rotas para gerenciamento de itens
 * Este arquivo contém todas as rotas relacionadas às operações CRUD de itens
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * GET /api/itens
 * Lista todos os itens cadastrados
 * Retorna os itens ordenados por data de criação (mais recentes primeiro)
 */
router.get('/', (req, res) => {
    db.query('SELECT * FROM itens ORDER BY data_criacao DESC', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

/**
 * GET /api/itens/:id
 * Busca um item específico pelo ID
 * @param {number} id - ID do item a ser buscado
 * @returns {Object} Item encontrado ou erro 404 se não encontrar
 */
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM itens WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Item não encontrado');
        res.json(result[0]);
    });
});

/**
 * POST /api/itens
 * Cria um novo item
 * @param {Object} req.body - Dados do item a ser criado
 * @param {string} req.body.nome - Nome do item (obrigatório)
 * @param {string} req.body.descricao - Descrição do item (opcional)
 * @param {string} req.body.status - Status do item (disponivel, em_uso, manutencao, descartado)
 * @param {number} req.body.quantidade - Quantidade do item
 * @param {string} req.body.observacao - Observações sobre o item (opcional)
 * @param {string} req.body.usuario - Usuário responsável pelo item (opcional)
 */
router.post('/', (req, res) => {
    const { nome, descricao, status, quantidade, observacao, usuario } = req.body;
    const sql = 'INSERT INTO itens (nome, descricao, status, quantidade, observacao, usuario) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [nome, descricao, status, quantidade, observacao, usuario], (err, result) => {
        if (err) return res.status(500).send(err);

        // Busca e retorna o item recém-criado
        db.query('SELECT * FROM itens WHERE id = ?', [result.insertId], (err, items) => {
            if (err) return res.status(500).send(err);
            res.status(201).json(items[0]);
        });
    });
});

/**
 * PUT /api/itens/:id
 * Atualiza um item existente
 * @param {number} id - ID do item a ser atualizado
 * @param {Object} req.body - Dados atualizados do item
 * @param {string} req.body.nome - Nome do item (obrigatório)
 * @param {string} req.body.descricao - Descrição do item (opcional)
 * @param {string} req.body.status - Status do item
 * @param {number} req.body.quantidade - Quantidade do item
 * @param {string} req.body.observacao - Observações sobre o item (opcional)
 * @param {string} req.body.usuario - Usuário responsável pelo item (opcional)
 */
router.put('/:id', (req, res) => {
    const { nome, descricao, status, quantidade, observacao, usuario } = req.body;
    const sql = 'UPDATE itens SET nome=?, descricao=?, status=?, quantidade=?, observacao=?, usuario=? WHERE id=?';

    db.query(sql, [nome, descricao, status, quantidade, observacao, usuario, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);

        // Busca e retorna o item atualizado
        db.query('SELECT * FROM itens WHERE id = ?', [req.params.id], (err, items) => {
            if (err) return res.status(500).send(err);
            if (items.length === 0) return res.status(404).send('Item não encontrado');
            res.json(items[0]);
        });
    });
});

/**
 * DELETE /api/itens/:id
 * Remove um item do sistema
 * @param {number} id - ID do item a ser removido
 * @returns {Object} Mensagem de sucesso ou erro
 */
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM itens WHERE id=?', [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Item não encontrado');
        res.json({ message: 'Item excluído com sucesso' });
    });
});

module.exports = router;