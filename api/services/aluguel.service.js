const db = require("../config/database.js");
const logger = require("../config/logger.js");

class AluguelService {
  static async atualizarAtrasados() {
    try {
      const sql = `
        UPDATE alugueis
        SET situacao = ?, dias_atrasos = DATEDIFF(CURDATE(), data_devolucao_prevista)
        WHERE data_devolucao_prevista < CURDATE()
        AND situacao = 'ativo'
      `;
      const conn = await db;
      const [result] = await conn.execute(sql, ["atrasado"]);
      return {
        success: true,
        message: `${result.affectedRows} aluguéis atualizados para atrasada`,
        affectedRows: result.affectedRows,
      };
    } catch (err) {
      logger.error("Erro ao tentar atualzar os atrasados. ", err);
      throw new Error({
        message:
          "Não foi possível atualizar os atrasados ao iniciar o servidor",
      });
    }
  }
}

module.exports = AluguelService;
