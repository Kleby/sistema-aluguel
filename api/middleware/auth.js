const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require("../config/logger.js");

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Gerar token JWT
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      tipo: user.tipo 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Middleware de autenticação
async function authMiddleware(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Acesso negado. Token não fornecido.' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar usuário no banco
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Token inválido. Usuário não encontrado.' 
      });
    }

    // Verificar se usuário está ativo e não expirou
    const isActive = await User.isActive(user);
    
    if (!isActive) {
      return res.status(401).json({ 
        error: 'Conta inativa ou expirada. Entre em contato com o administrador.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Erro na autenticação:', error);
    res.status(401).json({ 
      error: 'Token inválido ou expirado.' 
    });
  }
}

// Middleware de autorização (admin only)
function adminMiddleware(req, res, next) {
  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ 
      error: 'Acesso negado. Permissão de administrador necessária.' 
    });
  }
  next();
}

module.exports = {
  generateToken,
  authMiddleware,
  adminMiddleware,
  JWT_SECRET
};