const db = require('../config/database'); // ajuste o caminho conforme necessário

const Logger = require('../modules/utils/Console_Logger');
const logger = new Logger();


exports.getEstatisticasGerais = async (req, res) => {
  try {
    const [
      [usuarios],
      [tickets],
      [financeiro],
      [itens],
      [empresas],
      [pessoas],
      [auditoria],
      [categorias]
    ] = await Promise.all([
      db.execute(`SELECT COUNT(*) AS total, SUM(ativo) AS ativos, SUM(excluido) AS excluidos FROM RTS_usuario`),
      db.execute(`SELECT 
                  COUNT(*) AS total, 
                  SUM(CASE WHEN status_id IS NULL THEN 0 ELSE 1 END) AS com_status,
                  SUM(CASE WHEN data_encerramento IS NULL THEN 1 ELSE 0 END) AS abertos,
                  SUM(CASE WHEN data_encerramento IS NOT NULL THEN 1 ELSE 0 END) AS encerrados
                FROM TK_tickets WHERE excluido = 0`),
      db.execute(`SELECT 
                  COUNT(*) AS total_transacoes, 
                  SUM(CASE WHEN tipo = 'Entrada' THEN valor ELSE 0 END) AS total_entrada,
                  SUM(CASE WHEN tipo = 'Saída' THEN valor ELSE 0 END) AS total_saida,
                  SUM(CASE WHEN tipo = 'Transferência' THEN valor ELSE 0 END) AS total_transferencia
                FROM FX_transacao WHERE excluido = 0`),
      db.execute(`SELECT COUNT(*) AS total, SUM(quantidade) AS quantidade_total FROM CT_itens WHERE excluido = 0`),
      db.execute(`SELECT COUNT(*) AS total FROM RTS_empresa`),
      db.execute(`SELECT COUNT(*) AS total FROM RTS_pessoa`),
      db.execute(`SELECT COUNT(*) AS total FROM RTS_auditoria`),
      db.execute(`SELECT 
                  (SELECT COUNT(*) FROM FX_categoria WHERE ativo = 1) AS categorias_ativas,
                  (SELECT COUNT(*) FROM FX_subcategoria WHERE ativo = 1) AS subcategorias_ativas
                `)
    ]);

    const estatisticas = {
      sistema: {
        usuarios_totais: usuarios[0].total,
        usuarios_ativos: usuarios[0].ativos,
        usuarios_excluidos: usuarios[0].excluidos,
      },
      tickets: {
        total: tickets[0].total,
        abertos: tickets[0].abertos,
        encerrados: tickets[0].encerrados,
        com_status: tickets[0].com_status,
      },
      financeiro: {
        total_transacoes: financeiro[0].total_transacoes,
        total_entrada: financeiro[0].total_entrada,
        total_saida: financeiro[0].total_saida,
        total_transferencia: financeiro[0].total_transferencia,
        saldo_estimado: (financeiro[0].total_entrada || 0) - (financeiro[0].total_saida || 0),
      },
      controle_itens: {
        total_itens: itens[0].total,
        quantidade_total: itens[0].quantidade_total,
      },
      cadastros: {
        pessoas: pessoas[0].total,
        empresas: empresas[0].total,
      },
      auditoria: {
        total_registros: auditoria[0].total,
      },
      categorias: {
        categorias_ativas: categorias[0].categorias_ativas,
        subcategorias_ativas: categorias[0].subcategorias_ativas,
      },
      ultima_atualizacao: new Date(),
    };

    logger.Success('Estatísticas gerais atualizadas.');
    return res.status(200).json(estatisticas);

  } catch (error) {
    logger.Error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ erro: 'Erro ao buscar estatísticas gerais.', detalhes: error.message });
  }
};
