const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const logger = require("../config/logger.js");

const {
  generateToken,
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth");

// POST - Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Validar campos
    if (!email || !senha) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios.",
      });
    }
    
    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: "Credenciais inválidas.",
      });
    }

    // Verificar senha
    const isPasswordValid = await User.checkPassword(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Credenciais inválidas.",
      });
    }

    // Verificar se conta está ativa e não expirou
    const isActive = await User.isActive(user);

    if (!isActive) {
      return res.status(401).json({
        error:
          "Conta inativa ou expirada. Entre em contato com o administrador.",
      });
    }

    // Gerar token
    const token = generateToken(user);

    // Retornar dados do usuário (sem senha)
    const userData = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      status: user.status,
      data_expiracao: user.data_expiracao,
    };

    res.json({
      message: "Login realizado com sucesso!",
      token,
      user: userData,
    });
  } catch (error) {
    logger.error("Erro no login:", error);
    res.status(500).json({
      error: "Erro interno do servidor.",
    });
  }
});

// POST - Verificar token
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado.",
      });
    }

    const userData = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      status: user.status,
      data_expiracao: user.data_expiracao,
    };

    res.json({
      valid: true,
      user: userData,
    });
  } catch (error) {
    logger.error("Erro ao verificar token:", error);
    res.status(500).json({
      error: "Erro interno do servidor.",
    });
  }
});

module.exports = router;
