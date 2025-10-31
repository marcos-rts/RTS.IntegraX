const db = require('../../../config/database');
const auditoriaController = require('../../../controller/audit');
const Logger = require('../../utils/Console_Logger');
const logger = new Logger();

/**
 * Retorna todas as empresas cadastradas.
 */
const empresa = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM RTS_empresa');
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Nenhuma empresa encontrada.' });
        }
        res.status(200).json(rows);
    } catch (error) {
        logger.Error('Erro ao buscar empresas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

/**
 * Cria uma nova empresa.
 */
const createEmpresa = async (req, res) => {
    try {
        const {
            nome,
            nome_fantasia,
            cnpj,
            tipo_empresa,
            setor_atividade,
            criado_por_id
        } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'O campo nome é obrigatório.' });
        }

        const [result] = await db.execute(
            `INSERT INTO RTS_empresa 
                (nome, nome_fantasia, cnpj, tipo_empresa, setor_atividade, criado_por_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, nome_fantasia || null, cnpj || null, tipo_empresa || 'Privada', setor_atividade || null, criado_por_id || null]
        );

        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "RTS_empresa",
            acao: "CRIAR",
            depois: JSON.stringify({ nome, nome_fantasia, cnpj, tipo_empresa, setor_atividade, criado_por_id }),
            feito_por_id: criado_por_id || null,
            endpoint: "/api/empresa/createEmpresa",
            status_code: 201
        });

        logger.Success(`Empresa criada com sucesso: ID ${result.insertId}`);
        res.status(201).json({
            message: 'Empresa criada com sucesso!',
            id: result.insertId,
            data: { nome, nome_fantasia, cnpj, tipo_empresa, setor_atividade }
        });
    } catch (error) {
        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "RTS_empresa",
            acao: "CRIAR",
            depois: JSON.stringify(req.body),
            feito_por_id: req.body.criado_por_id || null,
            endpoint: "/api/empresa/createEmpresa",
            status_code: 500
        });
        logger.Error('Erro ao criar empresa:', error);
        res.status(500).json({ error: 'Erro ao criar empresa', details: error.message });
    }
};

/**
 * Atualiza uma empresa existente.
 */
const updateEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nome,
            nome_fantasia,
            cnpj,
            tipo_empresa,
            setor_atividade,
            atualizado_por_id
        } = req.body;

        const [result] = await db.execute(
            `UPDATE RTS_empresa 
             SET nome = ?, nome_fantasia = ?, cnpj = ?, tipo_empresa = ?, setor_atividade = ?, atualizado_por_id = ?
             WHERE id = ?`,
            [nome, nome_fantasia, cnpj, tipo_empresa, setor_atividade, atualizado_por_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "RTS_empresa",
            acao: "ATUALIZAR",
            depois: JSON.stringify(req.body),
            feito_por_id: atualizado_por_id || null,
            endpoint: `/api/empresa/update/${id}`,
            status_code: 200
        });

        logger.Success(`Empresa ID ${id} atualizada com sucesso.`);
        res.status(200).json({ message: 'Empresa atualizada com sucesso.' });
    } catch (error) {
        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "RTS_empresa",
            acao: "ATUALIZAR",
            depois: JSON.stringify(req.body),
            feito_por_id: req.body.atualizado_por_id || null,
            endpoint: `/api/empresa/update/${req.params.id}`,
            status_code: 500
        });
        logger.Error('Erro ao atualizar empresa:', error);
        res.status(500).json({ error: 'Erro ao atualizar empresa', details: error.message });
    }
};

/**
 * Deleta uma empresa.
 */
const deleteEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        const { feito_por_id } = req.body;

        const [result] = await db.execute('DELETE FROM RTS_empresa WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "RTS_empresa",
            acao: "DELETAR",
            antes: JSON.stringify({ id }),
            feito_por_id: feito_por_id || null,
            endpoint: `/api/empresa/delete/${id}`,
            status_code: 200
        });

        logger.Success(`Empresa ID ${id} deletada com sucesso.`);
        res.status(200).json({ message: 'Empresa deletada com sucesso.' });
    } catch (error) {
        await auditoriaController.adicionarAuditoriaInterna({
            tabela: "RTS_empresa",
            acao: "DELETAR",
            antes: JSON.stringify({ id: req.params.id }),
            feito_por_id: req.body.feito_por_id || null,
            endpoint: `/api/empresa/delete/${req.params.id}`,
            status_code: 500
        });
        logger.Error('Erro ao deletar empresa:', error);
        res.status(500).json({ error: 'Erro ao deletar empresa', details: error.message });
    }
};

module.exports = {
    empresa,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa
};
