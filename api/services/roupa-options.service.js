const db = require("../config/database.js");
const logger = require("../config/logger.js");

class RoupaOptionsService {
  static async obterCategorias() {
    try {
      const sql = `
        SELECT id, nome
        FROM categorias;
      `;
      const conn = await db;
      const [results] = await conn.execute(sql);
      
      return results;
    } catch (err) {
      logger.error("Erro ao tentar obter as categorias. ", err);
      throw new Error({
        message:
          "Não foi possível obter as categorias",
      });
    }
  }
  static async obterCategoriaPorId(id) {
    try {
      const sql = `
        SELECT id, nome
        FROM categorias
          WHERE id = ?
        ;
      `;
      const conn = await db;
      const [results] = await conn.execute(sql,[id]);
      
      return results[0];
    } catch (err) {
      logger.error("Erro ao tentar obter as categorias. ", err);
      throw new Error({
        message:
          "Não foi possível obter as categorias",
      });
    }
  }

  static async obterTamanhos() {
    try {
      const sql = `
        SELECT id, nome
        FROM tamanhos;
      `;
      const conn = await db;
      const [results] = await conn.execute(sql);

      return results
    } catch (err) {
      logger.error("Erro ao tentar obter os tamanhos. ", err);
      throw new Error({
        message:
          "Não foi possível obter os tamanhos",
      });
    }
  }
  static async obterTamanhoPorId(id) {
    try {
      const sql = `
        SELECT id, nome
        FROM tamanhos
          WHERE id = ?
        ;
      `;
      const conn = await db;
      const [results] = await conn.execute(sql, [id]);

      return results[0]
    } catch (err) {
      logger.error("Erro ao tentar obter os tamanhos. ", err);
      throw new Error({
        message:
          "Não foi possível obter os tamanhos",
      });
    }
  }

}

module.exports = RoupaOptionsService;
