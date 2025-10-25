const express = require("express");
const router = express.Router();
const Aluguel = require("../models/repository/Aluguel.repository.js");
const { authMiddleware } = require("../middleware/auth");

// Aplicar autenticação em todas as rotas
router.use(authMiddleware);

// GET - Listar todos os aluguéis
router.get("/", async (req, res) => {
  try {
    const { orderBy } = req.query.orderBy ?? '';
    const alugueis = await Aluguel.obterTodos(orderBy);
    return res.status(200).json(alugueis);
  } catch (err) {
    console.log("error no todos:");
    
    console.error("sttaus code: "+err);
    res.status(400).json({
      message: err.message,
      error: "Não foi possivel listar todos os alugueis",
    });
  }
});

// GET - Listar todos os aluguéis
router.get("/ativos", async (req, res) => {
  try {
    const { orderBy } = req.query.orderBy ?? '';
    const alugueis = await Aluguel.obterTodosDTO(orderBy);
    return res.status(200).json(alugueis);
  } catch (err) {
    console.log("error no todos:");
    
    console.error("sttaus code: "+err);
    res.status(400).json({
      message: err.message,
      error: "Não foi possivel listar todos os alugueis",
    });
  }
});

// Obter por id
router.get("id/:id", async (req, res) => {
  try {
    const aluguel = await Aluguel.obterPorId(req.params.id);
    return res.status(200).json(aluguel);
  } catch (err) {
    console.error(err.message);
    return res.status(err.statusCode).json(err.message);
  }
});

// obter pro cliente
router.get("cliente/:nome", async (req, res) => {
  try {
    const aluguel = await Aluguel.obterPorNomeCliente(req.params.nome);

    return res.status(200).json(aluguel);
  } catch (err) {
    console.error(err.message);
    return res.status(400).json(err);
  }
});
//obter pelo o id do cliente
router.get("cliente/id/:cliente_id", async (req, res) => {
  try {
    const aluguel = await Aluguel.obterPorIdCliente(req.params.cliente_id);
    return res.status(200).json(aluguel);
  } catch (err) {
    console.error(err.message);
    return res.status(400).json(err);
  }
});

// POST - Criar novo aluguel
router.post("/", async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const {
      cliente_id,
      roupa_id,
      data_aluguel,
      data_devolucao_prevista,
      valor_taxa,
      valor_total
    } = req.body;
    const aluguel = await Aluguel.criar({
      cliente_id,
      roupa_id,
      data_aluguel,
      data_devolucao_prevista,
      valor_total,
      valor_taxa,
      usuario_id
    });

    return res.status(201).json(aluguel);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      message: err.message,
      error: "Error ao criar aluguel: " + err,
    });
  }
});

// Atualizar dados do aluguel
router.put("/:id", async (req, res) => {
  try {
    const {
      cliente_id,
      roupa_id,
      data_aluguel,
      data_devolucao_prevista,
      valor_total,
    } = req.body;

    const id = req.params.id;

    const aluguel = await Aluguel.atualizar({
      id,
      cliente_id,
      roupa_id,
      data_aluguel,
      data_devolucao_prevista,
      valor_total,
    });

    return res.status(200).json(aluguel);
  } catch (err) {
    console.error(err.message);
    return res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const aluguelDeltado = await Aluguel.deletar(id);
    res.status(200).json(aluguelDeltado);
  } catch (err) {
    console.error(err.message);
    return res.status(statusCode).json(err);
  }
});

module.exports = router;
