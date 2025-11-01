const db = require("../../config/database.js");
const logger = require("../../config/logger.js");

class Roupa {
  static async criar(roupa, imagemUrl) {
    const { nome, descricao, tamanho_id, categoria_id, preco_aluguel, preco_compra, quantidade } = roupa;
    try {
      const conn = await db;
      const sql = `
            INSERT INTO roupas (nome, descricao, tamanho_id, categoria_id, preco_aluguel, preco_compra, quantidade, imagem_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;
      await conn.execute(sql, [
        nome,
        descricao,
        tamanho_id,
        categoria_id,
        parseFloat(preco_aluguel),
        parseFloat(preco_compra),
        parseInt(quantidade),
        imagemUrl ?? null,
      ]);

      return {
        success: true,
        mesage: "Roupa adicionada com sucesso!",
        id: roupa.id,
        imagemUrl: imagemUrl ?? "Sem imagem",
      };
    } catch (err) {
      logger.error("Não foi possivél adicionar a roupa. Error: " + err);
      throw new Error({
        message: "Error ao tentar adicionar a roupa. Error:" + err.message,
        statusCode: 400,
      });
    }
  }
  static async obterTodos(orderBy = "rp.nome") {
    try {
      const conn = await db;
      if (orderBy === "rp.status") {
        orderBy = `FIELD('rp.status', 'disponivel','alugado','manutencao')`;
      }       
      const sql = `
        SELECT 
            rp.id,
            rp.nome as nome,
            rp.descricao,
            cat.nome as categoria,
            rp.tamanho_id,
            tam.nome as tamanho,
            rp.categoria_id, 
            rp.preco_aluguel,
            rp.preco_compra,
            rp.quantidade,
            rp.status,
            rp.imagem_url
        FROM roupas AS rp
        LEFT JOIN tamanhos AS tam ON tam.id=tamanho_id
        LEFT JOIN categorias AS cat on cat.id = categoria_id
        ORDER BY ${orderBy}
    `;
      const [results] = await conn.execute(sql);
      return results;
    } catch (err) {
      logger.error("Não foi possível solicitar as roupas " + err);        
      throw new Error({
        message: "Erro ao tentar obter as roupas. Error: " + err,
        statusCode: 400,
      });
    }
  }

  static async obterPorId(id) {
    
    try {
      const sql = `
          SELECT 
            rp.id,
            rp.nome,
            rp.descricao,
            cat.nome as categoria,
            rp.tamanho_id,
            tam.nome as tamanho,
            rp.categoria_id, 
            rp.preco_aluguel,
            rp.preco_compra,
            rp.quantidade,
            rp.status,
            rp.imagem_url
          FROM roupas AS RP
          LEFT JOIN tamanhos AS tam ON tam.id=tamanho_id 
          LEFT JOIN categorias AS cat ON cat.id=categoria_id
          WHERE rp.id = ?
          ORDER BY rp.nome
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [id]);      
      return results[0];
    } catch (err) {
      logger.error("Não foi possível obter as roupas" + err);
      throw new Error({
        message: "Erro ao tentar obter as roupas por id. Error: " + err,
        statusCode: 400,
      });
    }
  }
  static async obterPorNome(nome) {
    try {
      const sql = `
            rp.id,
            rp.nome,
            rp.descricao,
            cat.nome,
            rp.tamanho_id,
            tam.nome,
            rp.categoria_id, 
            rp.preco_aluguel,
            rp.preco_compra,
            rp.quantidade,
            rp.status,
            rp.imagem_url
          FROM roupas AS RP
          LEFT JOIN tamanhos AS tam ON tam.id=tamanho_id 
          LEFT JOIN categorias AS cat ON cat.id=categoria_id
          WHERE rp.nome = ?
          ORDER BY rp.nome
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [nome]);
      return results[0];
    } catch (err) {
      logger.error("Não foi possível obter as roupas" + err);
      throw new Error({
        message: "Erro ao tentar obter as roupas por nome. Error: " + err,
        statusCode: 400,
      });
    }
  }
  static async obterPorstatus(status) {
    try {
      const sql = `
            rp.id,
            rp.nome,
            rp.descricao,
            cat.nome,
            rp.tamanho_id,
            tam.nome,
            rp.categoria_id, 
            rp.preco_aluguel,
            rp.preco_compra,
            rp.quantidade,
            rp.status,
            rp.imagem_url
          FROM roupas AS RP
          LEFT JOIN tamanhos AS tam ON tam.id=tamanho_id 
          LEFT JOIN categorias AS cat ON cat.id=categoria_id
          WHERE rp.status = ?
          ORDER BY rp.nome
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [status]);
      return results[0];
    } catch (err) {
      logger.error("Não foi possível obter as roupas" + err);
      throw new Error({
        message: "Erro ao tentar obter as roupas por status. Error: " + err,
        statusCode: 400,
      });
    }
  }

  static async atualizar(id, roupaAtualizada) {

    const {
      nome,
      descricao,
      tamanho_id,
      categoria_id,
      preco_aluguel,
      preco_compra,
      quantidade,
      status,
      imagem_url,
    } = roupaAtualizada;
    console.log("roupa atualizada");
    console.log(roupaAtualizada);
    console.log("roupa atualizada");
    let conn;
    
    try {
      conn = await db;
      conn.beginTransaction();
      const sql = `
            UPDATE roupas 
            SET 
              nome = ?, 
              descricao = ?, 
              tamanho_id = ?,
              categoria_id = ?,
              preco_aluguel = ?,
              preco_compra = ?,
              quantidade = ?,
              status = ?,
              imagem_url = ?
            WHERE id = ?
            `;

      const [results] = await conn.execute(sql, [
        nome,
        descricao,
        tamanho_id,
        categoria_id,
        parseFloat(preco_aluguel),
        parseFloat(preco_compra),
        parseInt(quantidade),
        status || "disponivel",
        imagem_url ?? null,
        id,
      ]);

      if (results.affectedRows === 0) {
        conn.rollback();
        throw new Error("Roupa não encontrada");
      }
      conn.commit();
      return {
        success: true,
        mesage: "Roupa atualizada com sucesso!",
        id: id,
      };
    } catch (err) {
      logger.error("Não foi possível atualizar a roupa:", err);
      if(conn){
        conn.rollback();
      }
      throw err;
    }
  }

  static async obterImagem(id) {
    try {
      const sql = `SELECT imagem_url FROM roupas WHERE id=?`;
      const conn = await db;
      const [results] = await conn.execute(sql, [id]);

      if (results.length === 0) {
        return null;
      }

      return results[0].imagem_url;
    } catch (err) {
      logger.error("Não foi possível obter a imagem:", err);
      throw new Error("Não foi possível obter a imagem: " + err.message);
    }
  }

  static async deletar(id) {
    try {
      const sql = `
        DELETE TABLE roupas
        WHERE id = ?
        `;
      const conn = await db;
      await conn.execute(sql, [id]);
      return {
        success: true,
        message: "Roupa deletada com sucesso!",
        statusCode: 200,
      };
    } catch (err) {
      logger.error("Não foi possíevel deletar a roupa" + err);
      throw new Error({
        message: "Não foi possível deletar a roupa" + err,
        statusCode: 500,
      });
    }
  }
}

module.exports = Roupa;
