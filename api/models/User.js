const db = require("../config/database");
const bcrypt = require("bcryptjs");

class User {
  // Criar usuário
  static async create(userData) {
    const { nome, email, senha, tipo } = userData;

    try {
      // Hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(senha, saltRounds);
      const sql = `
      INSERT INTO usuarios (nome, email, senha, tipo, status, data_expiracao) 
      VALUES (?, ?, ?, ?, 'ativo', DATE_ADD(NOW(), INTERVAL 30 DAY))
      `;

      const conn = await db;
      const [results] = await conn.execute(sql, [nome, email, hashedPassword, tipo]);
      return results;
    } catch (err) {
      console.error("Erro ao criar usuário: ", err);
      throw err;
    }
  }

  // Buscar por email
  static async findByEmail(email) {
    try {
      const sql = "SELECT * FROM usuarios WHERE email = ?";
      const conn = await db;
      const [results] = await conn.execute(sql, [email]);
      return results[0];
    } catch (err) {
      console.error("Erro ao buscar por email: " + email + " error: " + err);
      throw err;
    }
  }

  // Buscar por ID
  static async findById(id) {
    try {
      const sql =
        "SELECT id, nome, email, tipo, status, data_expiracao FROM usuarios WHERE id = ?";
      const conn = await db;
      const [results] = await conn.execute(sql, [id]);
      return results[0];
    } catch (err) {
      console.error("Erro ao buscar por id: " + id + " error: " + err);
      throw err;
    }
  }

  // Verificar senha
  static async checkPassword(senha, hashedPassword) {
    const result = await bcrypt.compare(senha, hashedPassword);
    return result;
  }

  // Atualizar data de expiração
  static async updateExpiration(userId, days) {
    try {
      const sql = `
        UPDATE usuarios 
        SET data_expiracao = DATE_ADD(NOW(), INTERVAL ? DAY) 
        WHERE id = ?
      `;
      const conn = await db;
      return await conn.execute(sql, [days, userId]);
    } catch (err) {
      console.error("Erro ao tentar atualizadar a data de expiração: id(" + userId + ") error: " + err);
      throw err;
    }

  }

  // Verificar se usuário está ativo e não expirado
  static async isActive(user) {
    if (!user) return false;
    if (user.status !== "ativo") return false;

    const now = new Date();
    const expirationDate = new Date(user.data_expiracao);

    return now < expirationDate;
  }
}

module.exports = User;
