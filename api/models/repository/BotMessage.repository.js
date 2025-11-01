const db = require("../../config/database.js");
const logger = require("../../config/logger.js");

class BotMessage {
  static async criar(mensagem) {
    try {
      const conn = await db;
      const sql = `INSERT INTO bot_mensagens(mensagem) VALUES(?);`;
      const [result] = await conn.execute(sql, mensagem);
      return {
        success: true,
        message: "Mensagem automática criada",
        id: result.id,
      };
    } catch (err) {
      logger.error(
        "Não foi possivél criar uma mensagem do bot. Error: " + err
      );
      throw new Error({
        message:
          "Error ao tentar criar uma mensagem do bot. Error:" + err.message,
      });
    }
  }

  static async obterTodas() {
    try {
      const conn = await db;
      const [results] = await conn.execute("SELECT * FROM bot_mensagens ;");
      return results;
    } catch (err) {
      logger.error("Não foi possivél obter as mensagens. Error: " + err);
      throw new Error({
        message: "Error ao tentar obter as mensagens. Error:" + err.message,
      });
    }
  }

  static async obterPorId(id) {
    try {
      const conn = await db;
      const sql = `SELECT * FROM bot_mensagens WHERE id = ? ;`;
      const [result] = await conn.execute(sql, [id]);
      return result[0];
    } catch (err) {
      logger.error("Não foi possivél obter a mensagem por id. Error: " + err);
      throw new Error({
        message:
          "Error ao tentar obter as mensagem por id. Error:" + err.message,
      });
    }
  }

  static async atualizar(id, msg) {
    try {
      const conn = await db;
      const [mensagemAntiga] = await conn.execute(
        "SELECT mensagem FROM bot_mensagens WHERE id = ? ;",
        [id]
      );
      if (!mensagemAntiga[0]) {
        logger.error("Não foi possíevel encontrar a mensagem por esse ID");
        throw new Error({
          message: "Mensagem não encontrada. Error:" + err.message,
        });
      }
      const { mensagem } = msg;
      const [result] = await conn.execute(
        "UPDATE bot_mensagens SET mensagem = ? WHERE id = ?;",
        [mensagem, id]
      );
      return {
        success: true,
        mensagemAntiga: mensagemAntiga[0].mensagem,
        message: "Mensagem automática atualizada",
        id: result.id,
      };
    } catch (err) {
      logger.error("Não foi possivél atualizar a mensagem. Error: " + err);
      throw new Error({
        message: "Error ao tentar atualizar a mensagem. Error:" + err.message,
      });
    }
  }

  static async deletar(id) {
    try {
      const conn = await db;
      const [mensagemExistente] = await conn.execute(
        "SELECT mensagem FROM bot_mensagens WHERE id = ? ;",
        [id]
      );
      if (!mensagemExistente[0]) {
        logger.error("Mesagem não econtrada pelo o id");
        throw new Error({
          message: "Error ao tentar deletar a mensagem. Error:",
        });
      }
      await conn.execute("DELETE FROM bot_mensagens WHERE id = ? ;", [id]);
      return {
        success: true,
        message: "Mensagem Deletada com sucesso!",
      }
    } catch (err) {
      logger.error("Não foi possivél deletar a mensagem. Error: " + err);
      throw new Error({
        message: "Error ao tentar deletar a mensagem. Error:" + err.message,
      });
    }
  }
}

module.exports = BotMessage;