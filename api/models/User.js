const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Criar usuário
  static async create(userData) {
    const { nome, email, senha, tipo } = userData;
    
    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);
    
    const sql = `
      INSERT INTO usuarios (nome, email, senha, tipo, status, data_expiracao) 
      VALUES (?, ?, ?, ?, 'ativo', DATE_ADD(NOW(), INTERVAL 30 DAY))
    `;
    
    return new Promise((resolve, reject) => {
      db.query(sql, [nome, email, hashedPassword, tipo], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  // Buscar por email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    
    return new Promise((resolve, reject) => {
      db.query(sql, [email], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  }

  // Buscar por ID
  static async findById(id) {
    const sql = 'SELECT id, nome, email, tipo, status, data_expiracao FROM usuarios WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  }

  // Verificar senha
  static async checkPassword(senha, hashedPassword) {
    return await bcrypt.compare(senha, hashedPassword);
  }

  // Atualizar data de expiração
  static async updateExpiration(userId, days) {
    const sql = 'UPDATE usuarios SET data_expiracao = DATE_ADD(NOW(), INTERVAL ? DAY) WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.query(sql, [days, userId], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  // Verificar se usuário está ativo e não expirado
  static async isActive(user) {
    if (!user) return false;
    if (user.status !== 'ativo') return false;
    
    const now = new Date();
    const expirationDate = new Date(user.data_expiracao);
    
    return now < expirationDate;
  }
}

module.exports = User;