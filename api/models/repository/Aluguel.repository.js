const db = require("../../config/database.js");

class Aluguel {
  static async criar(aluguel) {
    const {
      cliente_id,
      roupa_id,
      data_aluguel,
      data_devolucao_prevista,
      valor_total,
      usuario_id,
    } = aluguel;
    try {
      const conn = await db;
      const sql = `
            INSERT INTO alugueis (cliente_id, roupa_id, data_aluguel, data_devolucao_prevista, valor_total, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?);
            `;
      await conn.execute(sql, [
        cliente_id,
        roupa_id,
        data_aluguel,
        data_devolucao_prevista,
        valor_total,
        usuario_id,
      ]);

      const statusRoupaSql = `
        UPDATE roupas
        SET status = 'alugado'
        WHERE id = ?
      `
      await conn.execute(statusRoupaSql, [roupa_id]);

      return {
        success: true,
        mesage: "Aluguel criado com sucesso!",
        id: aluguel.id,
      };
    } catch (err) {
      console.error("Não foi possivél criar um aluguel. Error: " + err);
      throw new Error({
        message: "Error ao tentar criar um aluguel. Error:" + err.message,
        statusCode: 400,
      });
    }
  }
  static async obterTodos(orderBy = "data_devolucao_prevista", isStatus) {
    try {
      const conn = await db;
      const sql = `
        SELECT 
            data_aluguel,
            data_devolucao_prevista,
            valor_total,
            multa,
            status,
            ct.nome,
            rp.nome
        FROM dbo.alugueis on a
        LEFT JOIN dbo.clientes ct ON ct.id = a.cliente_id
        LEFT JOIN dbo.roupas rp ON rp.id = a.roupas_id
        ORDER BY ${
          isStatus
            ? "FIELD(" + orderBy + ",'ativo','devolvido','atrasado')"
            : orderBy
        }
    `;
      const [results] = await conn.execute(sql, [orderBy]);
      return results;
    } catch (err) {
      console.error("Não foi possível solicitar os alugueis" + err);
      throw new Error({
        message: "Erro ao tentar obter todo os alugueis. Error: " + err,
        statusCode: 400,
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
            a.multa,
            a.status,
            ct.nome,
            rp.nome
        FROM dbo.alugueis on a
        LEFT JOIN dbo.clientes ct ON ct.id = a.cliente_id
        LEFT JOIN dbo.roupas rp ON rp.id = a.roupas_id
        WHERE a.id = ?
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [id]);
      return results[0];
    } catch (err) {
      console.error("Não foi possível solicitar os alugueis" + err);
      throw new Error({
        message: "Erro ao tentar obter todo os alugueis por id. Error: " + err,
        statusCode: 400,
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
        data_aluguel,
        data_devolucao_prevista,
        valor_total,
        multa,
        status,
        ct.nome,
        rp.nome
        FROM dbo.alugueis on a
        LEFT JOIN dbo.clientes ct ON ct.id = a.cliente_id
        LEFT JOIN dbo.roupas rp ON rp.id = a.roupas_id
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
      console.error("Não foi possível solicitar os alugueis" + err);
      throw new Error({
        message:
          "Erro ao tentar obter todo os alugueis por Data. Error: " + err,
        statusCode: 400,
      });
    }
  }
  static async obterPorNomeCliente(nome) {
    try {
      const sql = `
        SELECT 
            data_aluguel,
            data_devolucao_prevista,
            valor_total,
            multa,
            status,
            ct.nome,
            rp.nome
        FROM dbo.alugueis on a
        LEFT JOIN dbo.clientes ct ON ct.id = a.cliente_id
        LEFT JOIN dbo.roupas rp ON rp.id = a.roupas_id
        WHERE ct.nome = ?
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [nome]);
      return results[0];
    } catch (err) {
      console.error("Não foi possível solicitar os alugueis" + err);
      throw new Error({
        message:
          "Erro ao tentar obter todo os alugueis por nome do cliente. Error: " +
          err,
        statusCode: 400,
      });
    }
  }
  static async obterPorIdCliente(clienteId) {
    try {
      const sql = `
        SELECT 
            data_aluguel,
            data_devolucao_prevista,
            valor_total,
            multa,
            status,
            ct.nome,
            rp.nome
        FROM dbo.alugueis on a
        LEFT JOIN dbo.clientes ct ON ct.id = a.cliente_id
        LEFT JOIN dbo.roupas rp ON rp.id = a.roupas_id
        WHERE ct.id = ?
    `;

      const conn = await db;
      const [results] = await conn.execute(sql, [clienteId]);
      return results[0];
    } catch (err) {
      console.error("Não foi possível solicitar os alugueis" + err);
      throw new Error({
        message:
          "Erro ao tentar obter todo os alugueis por id do cliente. Error: " +
          err,
        statusCode: 400,
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
        valor_total
      } = aluguel;

      const sql = `
            UPDATE clientes
            SET 
                cliente_id = ?,
                roupa_id = ?,
                data_aluguel = ?,
                data_devolucao_prevista = ?,
                valor_total = ?,
            WHERE id = ?
            `;

      const conn = await db;
      const [results] = await conn.execute(sql, [
        cliente_id,
        roupa_id,
        data_aluguel,
        data_devolucao_prevista,
        valor_total,
        id,
      ]);
      return results[0];
    } catch (err) {
      console.error("Não foi possível atualizar o aluguel. Error: " + err);
      throw new Error({
        message: "Não foi possível atualizar o aluguel. Error: " + err,
        statusCode: 400,
      });
    }
  }

  static async concluido(id, aluguelAtualizado) {
    try {
      const { data_devolucao_real, subtotal, valor_total, multa } = aluguelAtualizado;

      const sql = `
            UPDATE clientes
            SET 
                data_devolucao_real = ?,
                subtotal = ?,
                valor_total = ?,
                multa = ?
            WHERE id = ?
            `;

      const conn = await db;
      const [results] = await conn.execute(sql, [
        data_devolucao_real,
        subtotal,
        valor_total + multa,
        multa,
        id,
      ]);
      return results[0];
    } catch (err) {
      console.error("Não foi possível concluir o aluguel. Error: " + err);
      throw new Error({
        message: "Não foi possível concluir o aluguel. Error: " + err,
        statusCode: 400,
      });
    }
  }

  static async deletar(id){
    try {
        const sql = `
        DELETE TABLE alugueis
        WHERE id = ?
        `
        const conn = await db;
        await conn.execute(sql, [id]);
        return {
            success: true,
            message: "Aluguel deletado com sucesso!",
            statusCode: 200,
        }
    } catch (err) {
        console.error("Não foi possíevel deletar o aluguel" + err);
        throw new Error({
            message: "Não foi possível deletar o aluguel" + err,
            statusCode: 500,
        });
    }
  }
}


module.exports = Aluguel;