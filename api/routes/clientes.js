const express = require("express");
const router = express.Router();
const Cliente = require("../models/repository/Cliente.repository");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const logger = require("../config/logger.js");

// Aplicar autenticação em todas as rotas de clientes
router.use(authMiddleware);

// GET - Listar todos os clientes (apenas admin)
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const orderBy = req.query.orderBy;    
    const clientes = orderBy
    ? await Cliente.obterTodos(orderBy)
    : await Cliente.obterTodos();
    
    return res.status(200).json(clientes);
  } catch (err) {
    logger.error(err.message);
    res.status(404).json({
      error: "Erro ao consultar clientes",
    });
  }
});

// GET - Buscar cliente por ID (apenas admin)
router.get("/:id", adminMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const cliente = await Cliente.obterClientePorId(id);
    return res.status(200).json(cliente);
  } catch (err) {
      logger.error(err.message);
      res.status(404).json({
        error: "Erro ao consultar o cliente por id",
    });
  }
});

// POST - Criar novo cliente (apenas admin)
router.post("/", adminMiddleware, async (req, res) => {
  // const { nome, email, telefone, cpf, endereco } = await req.body;
  try {
    const novoCliente = await Cliente.criar(req.body)
    return res.status(201).json(novoCliente);
  } catch (err) {
      logger.error(err.message);
      res.status(500).json({
        error: "Erro ao consultar clientes. Error: " + err.message,
      });
  }
});

// PUT - Atualizar cliente (apenas admin)
router.put("/:id", adminMiddleware, async (req, res) => {

  try {
    const clienteAtualizado = await Cliente.atualizar(req.body);
    return res.status(200).json(clienteAtualizado);
  } catch (err) {
    logger.error(err.message);
    res.status(err.statusCode).json({
      error: "Erro ao tentar atualizar o cliente. Error: "+ err.message,
    });
  }
});

router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    
  } catch (err) {
    logger.error(err.message);
    res.status(err.statusCode).json({
      error: err.message
    });
  }
});

module.exports = router;
