const db = require("../../config/database.js");

class Roupa {
  static async criar(roupa, imagemUrl) {
    const { nome, descricao, tamanho, categoria, preco_aluguel } = roupa;
    try {
      const conn = await db;
      const sql = `
            INSERT INTO roupas (nome, descricao, tamanho, categoria, preco_aluguel, imagem_url)
            VALUES (?, ?, ?, ?, ?, ?);
            `;

      await conn.execute(sql, [
        nome,
        descricao,
        tamanho,
        categoria,
        parseFloat(preco_aluguel),
        imagemUrl ?? null,
      ]);

      return {
        success: true,
        mesage: "Roupa adicionada com sucesso!",
        id: roupa.id,
      };
    } catch (err) {
      console.error("Não foi possivél adicionar a roupa. Error: " + err);
      throw new Error({
        message: "Error ao tentar adicionar a roupa. Error:" + err.message,
        statusCode: 400,
      });
    }
  }
  static async obterTodos(orderBy = "nome") {
    try {
      const conn = await db;
      if (orderBy === "status") {
        orderBy = `FIELD('status', 'disponivel','alugado','manutencao')`;
      } else if (orderBy === "tamanho") {
        orderBy = `FIELD('tamanho', 'PP','P','M','G','GG')`;
      }
      const sql = `
        SELECT 
            nome,
            descricao,
            tamanho,
            categoria, 
            preco_aluguel,
            status,
            imagem_url
        FROM roupas
        ORDER BY ${orderBy}
    `;
      const [results] = await conn.execute(sql, [orderBy]);
      return results;
    } catch (err) {
      console.error("Não foi possível solicitar as roupas" + err);
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
            nome,
            descricao,
            tamanho,
            categoria, 
            preco_aluguel,
            status,
            imagem_url
          FROM roupas
          WHERE id = ?
          ORDER BY nome
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [id]);
      return results[0];
    } catch (err) {
      console.error("Não foi possível obter as roupas" + err);
      throw new Error({
        message: "Erro ao tentar obter as roupas por id. Error: " + err,
        statusCode: 400,
      });
    }
  }
  static async obterPorNome(nome) {
    try {
      const sql = `
          SELECT 
            nome,
            descricao,
            tamanho,
            categoria, 
            preco_aluguel,
            status,
            imagem_url
          FROM roupas
          WHERE nome = ?
          ORDER BY nome
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [nome]);
      return results[0];
    } catch (err) {
      console.error("Não foi possível obter as roupas" + err);
      throw new Error({
        message: "Erro ao tentar obter as roupas por nome. Error: " + err,
        statusCode: 400,
      });
    }
  }
  static async obterPorstatus(status) {
    try {
      const sql = `
          SELECT 
            nome,
            descricao,
            tamanho,
            categoria, 
            preco_aluguel,
            status,
            imagem_url
          FROM roupas
          WHERE status = ?
          ORDER BY nome
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [status]);
      return results[0];
    } catch (err) {
      console.error("Não foi possível obter as roupas" + err);
      throw new Error({
        message: "Erro ao tentar obter as roupas por status. Error: " + err,
        statusCode: 400,
      });
    }
  }
  static async obterPorTamanho(tamanho) {
    try {
      const sql = `
          SELECT 
            nome,
            descricao,
            tamanho,
            categoria, 
            preco_aluguel,
            status,
            imagem_url
          FROM roupas
          WHERE tamanho = ?
          ORDER BY nome
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [tamanho]);
      return results[0];
    } catch (err) {
      console.error("Não foi possível obter as roupas" + err);
      throw new Error({
        message: "Erro ao tentar obter as roupas por tamanho. Error: " + err,
        statusCode: 400,
      });
    }
  }
  static async obterPorCategoria(categoria) {
    try {
      const sql = `
          SELECT 
            nome,
            descricao,
            tamanho,
            categoria, 
            preco_aluguel,
            status,
            imagem_url
          FROM roupas
          WHERE categoria = ?
          ORDER BY nome
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [categoria]);
      return results[0];
    } catch (err) {
      console.error("Não foi possível obter as roupas" + err);
      throw new Error({
        message: "Erro ao tentar obter as roupas por id. Error: " + err,
        statusCode: 400,
      });
    }
  }

  static async atualizar(id, roupaAtualizada) {
    const { nome, descricao, tamanho, categoria, preco_aluguel, status, imagem_url } =
      roupaAtualizada;
    try {
      const conn = await db;
      const sql = `
            UPDATE roupas 
            SET 
              nome = ?, 
              descricao = ?, 
              tamanho = ?,
              categoria = ?,
              preco_aluguel = ?,
              status = ?,
              imagem_url = ?,
            WHERE id = ?;
            `;

      await conn.execute(sql, [
        nome,
        descricao,
        tamanho,
        categoria,
        parseFloat(preco_aluguel),
        status,
        imagem_url ?? null,
        id,
      ]);

      return {
        success: true,
        mesage: "Roupa atualizada com sucesso!",
        id: roupa.id,
      };
    } catch (err) {
      console.error("Não foi possivél atualizar a roupa. Error: " + err);
      throw new Error({
        message: "Error ao tentar atualizar a roupa. Error:" + err.message,
        statusCode: 400,
      });
    }
  }

  static async obterImagem(id) {
    try {
      const sql = `
      SELECT imagem_url FROM roupas WHERE id=?;
    `;
      const conn = await db;
      const [imagem_url] = await conn.execute(sql, [id]);
      return imagem_url[0];
      
    } catch (err) {
      console.error("Nçao foi possivel solicitar a imagem");
      throw new Error({
        message: "Não foi possível obter a imagem. Error: " + err,
        statusCode: 404,
      });
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
      console.error("Não foi possíevel deletar a roupa" + err);
      throw new Error({
        message: "Não foi possível deletar a roupa" + err,
        statusCode: 500,
      });
    }
  }
}

module.exports = Roupa;
