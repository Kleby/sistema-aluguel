const db = require("../../config/database.js");
const logger = require("../../config/logger.js");

class Aluguel {
  static async criar(aluguel) {
    const {
      cliente_id,
      roupa_id,
      data_aluguel,
      data_devolucao_prevista,
      valor_total,
      valor_taxa,
      usuario_id,
    } = aluguel;
    try {
      const conn = await db;
      // iniciar a transação para gantir a automicidade
      await conn.beginTransaction();
      const sql = `
            INSERT INTO alugueis 
            (cliente_id, roupa_id, data_aluguel, data_devolucao_prevista, valor_total, valor_taxa, usuario_id, subtotal )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;
      const [result] = await conn.execute(sql, [
        cliente_id,
        roupa_id,
        data_aluguel,
        data_devolucao_prevista,
        valor_total,
        valor_taxa || 0,
        usuario_id,
        valor_total,
      ]);

      const aluguelId = result.insertId;

      const statusRoupaSql = `
        UPDATE roupas
        SET status = 'alugado'
        WHERE id = ?
      `;
      const [updateResult] = await conn.execute(statusRoupaSql, [roupa_id]);

      if (updateResult.affectedRows === 0) {
        throw new Error("Roupa não encontrada para atualização de status");
      }

      // commitaer a transaction
      await conn.commit();

      return {
        success: true,
        message: "Aluguel criado com sucesso!",
        id: aluguelId,
        roupaAtualizada: updateResult.affectedRows > 0,
      };
    } catch (err) {
      // Rollback em caso de erro
      await conn.rollback();
      logger.error("Não foi possivél criar um aluguel. Error: " + err);
      throw new Error({
        message: "Error ao tentar criar um aluguel. Error:" + err.message,
      });
    }
  }
  static async obterTodos(orderBy = "a.data_devolucao_prevista") {
    try {
      const conn = await db;
      if (orderBy === "situacao") {
        orderBy = "FIELD( 'situacao','em dias' ,'devolvido','atrasado')";
      }
      const sql = `
        SELECT 
            a.id,
            rp.imagem_url AS roupa_imagem,
            ct.nome AS cliente_nome,
            rp.nome AS roupa_nome,
            a.data_aluguel,
            a.data_devolucao_prevista,
            a.data_devolucao_real,
            a.subtotal,
            a.situacao,
            a.dias_atrasos,
            a.valor_taxa,
            a.valor_total,
            a.cliente_id
        FROM alugueis AS a
        LEFT JOIN clientes AS ct ON ct.id = a.cliente_id
        LEFT JOIN roupas AS rp ON rp.id = a.roupa_id
        ORDER BY ${orderBy}
    `;
      const [results] = await conn.execute(sql, [orderBy]);

      return results;
    } catch (err) {
      logger.error("Não foi possível solicitar os alugueis. " + err);
      throw new Error({
        message: "Erro ao tentar obter todo os alugueis. Error: " + err,
      });
    }
  }
  static async obterTodosDTO(orderBy = "a.data_devolucao_prevista") {
    try {
      const conn = await db;
      if (orderBy === "situacao") {
        orderBy = "FIELD( 'situacao','em dias' ,'devolvido','atrasado')";
      }
      const sql = `
        SELECT 
            a.id,
            rp.imagem_url AS roupa_imagem,
            ct.nome AS cliente_nome,
            rp.nome AS roupa_nome,
            a.data_aluguel,
            a.data_devolucao_prevista,
            a.situacao,
            DATEDIFF(a.data_devolucao_prevista, a.data_aluguel) AS dias_atrasos,
            a.valor_total,
            a.subtotal,
            a.cliente_id
        FROM alugueis AS a
        LEFT JOIN clientes AS ct ON ct.id = a.cliente_id
        LEFT JOIN roupas AS rp ON rp.id = a.roupa_id
        ORDER BY ${orderBy}
    `;
      const [results] = await conn.execute(sql, [orderBy]);

      return results;
    } catch (err) {
      logger.error("Não foi possível solicitar os alugueis. " + err);
      throw new Error({
        message: "Erro ao tentar obter todo os alugueis. Error: " + err,
      });
    }
  }
  static async obterPorId(id) {
    try {
      const sql = `
        SELECT 
            a.data_aluguel,
            a.data_devolucao_prevista,
            a.valor_total,
            a.situacao,
            ct.nome AS cliente_nome,
            rp.nome AS roupa_nome
        FROM alugueis AS a
        LEFT JOIN clientes AS ct ON ct.id = a.cliente_id
        LEFT JOIN roupas AS rp ON rp.id = a.roupa_id
        WHERE a.id = ?
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [id]);
      return results[0];
    } catch (err) {
      logger.error("Não foi possível solicitar os alugueis" + err);
      throw new Error({
        message: "Erro ao tentar obter todo os alugueis por id. Error: " + err,
      });
    }
  }
  static async obterPorData(
    columnaName,
    dataInicial = new Date().toLocaleDateString() + " 00:00:00",
    dataFinal = new Date().toLocaleDateString() + " 23:59:59"
  ) {
    try {
      const sql = `
        SELECT 
        a.data_aluguel,
        a.data_devolucao_prevista,
        a.valor_total,
        a.situacao,
        ct.nome AS cliente_nome,
        rp.nome AS roupa_nome
        FROM alugueis AS a
        LEFT JOIN clientes AS ct ON ct.id = a.cliente_id
        LEFT JOIN roupas AS rp ON rp.id = a.roupa_id
        WHERE ?
        BETWEEN ? AND ?
        `;
      conn = await db;
      const [results] = await conn.execute(sql, [
        columnaName,
        dataInicial,
        dataFinal,
      ]);
      return results;
    } catch (err) {
      logger.error("Não foi possível solicitar os alugueis" + err);
      throw new Error({
        message:
          "Erro ao tentar obter todo os alugueis por Data. Error: " + err,
      });
    }
  }
  static async obterPorNomeCliente(nome) {
    try {
      const sql = `
        SELECT 
            a.data_aluguel,
            a.data_devolucao_prevista,
            a.valor_total,
            a.situacao,
            ct.nome AS cliente_nome,
            rp.nome AS roupa_nome
        FROM alugueis AS a
        LEFT JOIN clientes AS ct ON ct.id = a.cliente_id
        LEFT JOIN roupas AS rp ON rp.id = a.roupa_id
        WHERE ct.nome = ?
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [nome]);
      return results[0];
    } catch (err) {
      logger.error("Não foi possível solicitar os alugueis" + err);
      throw new Error({
        message:
          "Erro ao tentar obter todo os alugueis por nome do cliente. Error: " +
          err,
      });
    }
  }
  static async obterPorIdCliente(clienteId) {
    try {
      const sql = `
        SELECT 
            a.data_aluguel,
            a.data_devolucao_prevista,
            a.valor_total,
            a.situacao,
            ct.nome AS cliente_nome,
            rp.nome AS roupa_nome
        FROM alugueis AS a
        LEFT JOIN clientes AS ct ON ct.id = a.cliente_id
        LEFT JOIN roupas AS rp ON rp.id = a.roupa_id
        WHERE ct.id = ?
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [clienteId]);
      return results[0];
    } catch (err) {
      logger.error("Não foi possível solicitar os alugueis " + err);
      throw new Error({
        message:
          "Erro ao tentar obter todo os alugueis por id do cliente. Error: " +
          err,
      });
    }
  }
  static async atualizar(id, aluguel) {
    try {
      const {
        cliente_id,
        roupa_id,
        data_aluguel,
        data_devolucao_prevista,
        valor_total,
        valor_taxa,
      } = aluguel;

      const sql = `
            UPDATE clientes
            SET 
                cliente_id = ?,
                roupa_id = ?,
                data_aluguel = ?,
                data_devolucao_prevista = ?,
                valor_total = ?,
                valor_taxa = ?
            WHERE id = ?
            `;

      const conn = await db;
      const [results] = await conn.execute(sql, [
        cliente_id,
        roupa_id,
        data_aluguel,
        data_devolucao_prevista,
        valor_total,
        valor_taxa,
        id,
      ]);
      return results[0];
    } catch (err) {
      logger.error("Não foi possível atualizar o aluguel. Error: " + err);
      throw new Error({
        message: "Não foi possível atualizar o aluguel. Error: " + err,
      });
    }
  }

  static async concluido(id, aluguelAtualizado) {
    try {
      const { data_devolucao_real, situacao, subtotal, valor_total, multa } =
        aluguelAtualizado;

      const sql = `
            UPDATE clientes
            SET 
                data_devolucao_real = ?,
                subtotal = ?,
                valor_total = ?,
                multa = ?,
                situacao = ?
            WHERE id = ?
            `;

      const conn = await db;
      const [results] = await conn.execute(sql, [
        data_devolucao_real,
        subtotal,
        valor_total + multa,
        multa,
        situacao,
        id,
      ]);
      return results[0];
    } catch (err) {
      logger.error("Não foi possível concluir o aluguel. Error: " + err);
      throw new Error({
        message: "Não foi possível concluir o aluguel. Error: " + err,
      });
    }
  }

  static async deletar(id) {
    try {
      const sql = `
        DELETE TABLE alugueis
        WHERE id = ?
        `;
      const conn = await db;
      await conn.execute(sql, [id]);
      return {
        success: true,
        message: "Aluguel deletado com sucesso!",
      };
    } catch (err) {
      logger.error("Não foi possíevel deletar o aluguel" + err);
      throw new Error({
        message: "Não foi possível deletar o aluguel" + err,
      });
    }
  }

  static async obterAtrasados(data_devolucao_prevista, situacao) {
    let conn;
    try {
      if (situacao === "atrasado") {
        const sql = `
            SELECT 
              a.valor_total,
              a.data_devolucao_prevista,
              c.nome,
              r.nome
            FROM alugueis AS a
            LEFT JOIN clientes as c on a.cliente_id=c.id
            LEFT JOIN roupas as r ON a.roupa_id=r.id
            WHERE  DATEDIFF(CURDATE(), data_devolucao_prevista) <= ?
            AND situcao = ?
        `;

        conn = await db;
        await conn.beginTransaction();
        const [results] = await conn.execute(sql, [
          data_devolucao_prevista,
          situacao,
        ]);
        await conn.commit();
        return results;
      }
    } catch (err) {
      logger.error("Não foi possíevel obter o aluguel atrasado" + err);
      if(conn){
        await conn.rollback();
      }
      throw new Error({
        message: "Não foi possível obter os alugueis atrasados" + err,
      });
    }
  }
}

module.exports = Aluguel;
