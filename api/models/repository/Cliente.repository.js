const db = require("../../config/database.js");
const logger = require("../../config/logger.js");

class Cliente {
  static async criar(clienteDados) {
    const { nome, email, telefone, cpf, endereco } = clienteDados;
    try {
      if (!nome || !email || !cpf) {
        throw new Error({
          message: "Nome, email e CPF são obrigatórios",
          statusCode: 400,
        });
      }
      const conn = await db;
      const checarEmailSql = `
        SELECT * 
        FROM clientes
        WHERE email=?
        `;
      
      
      const [emailsExistentes] = await conn.execute(checarEmailSql, [email]);      
      if (emailsExistentes.length > 0) {
        throw new Error("Já existe um cliente com este email!");
      }

      const checarCPFSql = `
        SELECT * 
        FROM clientes
        WHERE cpf=?
      `;
      const [CPFExistentes] = await conn.execute(checarCPFSql, [cpf]);
      if (CPFExistentes.length > 0) {
        throw new Error("Já existe um cliente cadastrado com este CPF");
      }
      const criarClienteSql = `
        INSERT INTO clientes (nome, email, telefone, cpf, endereco)
        VALUES(?, ?, ?, ?, ?);
      `;

      const [results] = await conn.execute(criarClienteSql, [
        nome,
        email,
        telefone,
        cpf,
        endereco,
      ]);
      return {
        success: true,
        message: "Cliente cadastrado com sucesso!",
        id: results.insertId,
      };
    } catch (err) {
      logger.error("Erro ao criar cliente:", err);
      if (err.message.includes("já existe")) {
        throw new Error({
          message: "Já existe",
          statusCode: 409,
        });
      }
      if (err.code === "ER_DUP_ENTRY") {
        if (err.message.includes("email")) {
          throw new Error({
            message: "Já existe um cliente cadastrado com este email: mesagem de throw new error email",
            statusCode: 409,
          });
        } else if (err.message.includes("cpf")) {
          throw new Error({
            message: "Já existe um cliente cadastrado com este CPF",
            statusCode: 409,
          });
        }
      }
    }
  }

  static async obterPorId(id) {
    try {
      const sql = `
        SELECT * 
        FROM clientes
        WHERE id=?
      `;
      const conn = await db;
      const results = await conn.execute(sql, [id]);
      return results[0];
    } catch (err) {
      logger.error("Erro ao buscar cliente por id: " + id + " error: " + err);
      throw err;
    }
  }

  static async obterPorEmail(email) {
    try {
      const sql = `
              SELECT * 
              FROM clientes
              WHERE email=?
      `;
      const conn = await db;
      const [results] = await conn.execute(sql, [email.trim().toLowerCase()]);
      return results[0];
    } catch (err) {
      logger.error(
        "Erro ao buscar cliente por email: " + email + " error: " + err
      );
      throw err;
    }
  }

  static async obterPorNome(nome) {
    try {
      const conn = await db;
      const sql = `
        SELECT *
        FROM clientes
        WHERE nome=?
      `;
      const [results] = await conn.execute(sql, [nome.trim().toLowerCase()]);
      return results[0];
    } catch (err) {
      logger.error("Erro ao obter clientes por nome!");
      throw new Error("Erro ao obter clientes por nome");
    }
  }

  static async obterTodos(orderBy = "nome") {
    try {
      const conn = await db;
      const [results] = await conn.execute("SELECT * FROM clientes ORDER BY ?", [orderBy]);
      return results;
    } catch (err) {
      logger.error("Erro ao obter todos os clientes!");
      throw new Error("Erro ao tentar buscar todos os clientes");
    }
  }

  static async atualizarPorId(id, novosDadosCliente) {
    try {
      const conn = await db;
      const clienteExistenteSql = `
        SELECT * 
        FROM clientes
        WHERE id=?
      `;
      const existenteClientes = await conn.execute(clienteExistenteSql, id);
      if (!existenteClientes.length) {
        logger.error("Cliente não encontrado pelo o id: " + id);
        throw new Error("Cliente não encontrado");
      }
      const { nome, email, telefone, cpf, endereco } = novosDadosCliente;
      const atualizarClienteSql = `
          UPDATE clientes
          SET 
            nome = ?,
            email = ?,
            telefone = ?,
            cpf = ?,
            endereco = ?
          `;
      return await conn.execute(atualizarClienteSql, [
        nome,
        email,
        telefone,
        cpf,
        endereco,
      ]);
    } catch (err) {
      logger.error("Erro ao atualizar Cliente: ", err);
      throw err;
    }
  }

  static async atualizar({ nome, email, telefone, cpf, endereco }) {
    try {
      if (!nome || !email || !cpf) {
        throw new Error({
          message: "Nome, email e CPF são obrigatórios",
          statusCode: 400,
        });
      }

      const sql = `
        UPDATE clientes
        SET 
          nome = ?, email=?, telefone=?, cpf=?, endereco=?
          WHERE id=?
      `;
      const conn = await db;
      return await conn.execute(sql, [nome, email, telefone, cpf, endereco]);

    } catch (err) {
      logger.error("Erro ao atualizar o cliente:", err);
      if (err.message.includes("já existe")) {
        throw new Error({
          message: "Já existe",
          statusCode: 409,
        });
      }
      if (err.code === "ER_DUP_ENTRY") {
        if (err.message.includes("email")) {
          throw new Error({
            message: "Já existe um cliente cadastrado com este email",
            statusCode: 409,
          });
        } else if (err.message.includes("cpf")) {
          throw new Error({
            message: "Já existe um cliente cadastrado com este CPF",
            statusCode: 409,
          });
        }
      }
    }
  }

  static async deletarPorId(id) {
    try {
      const conn = await db;
      const sql = `
        DELETE FROM clientes
        WHERE id=?;
      `;
      await conn.execute(sql, [id]);
      return {
        success: true,
        message: "Cliente deletado com sucesso!",
      };
    } catch (err) {
      logger.error("Erro ao deletar Cliente: ", err);
      throw new Error({
        message: "Error ao tentar delatar cliente. Error: "+ err,
        statusCode: 404,
      });
    }
  }
}

module.exports = Cliente;
