const express = require("express");
const router = express.Router();
const Roupa = require("../models/repository/Roupa.repository.js");
const upload = require("../config/upload");
const { authMiddleware } = require("../middleware/auth");

// Aplicar autenticação em todas as rotas
router.use(authMiddleware);

// GET - Listar todas as roupas
router.get("/", async (req, res) => {
  try {
    const orderBy = req.query.orderBy ?? "nome";
    const roupas = await Roupa.obterTodos(orderBy);
    return res.status(200).json(roupas);
  } catch (err) {
    console.error(err.message);
    return res.status(err.statusCode).json(err);
  }
});

// Buscar por id
router.get("/:id", async (req,res) => {
  try {
    const id = req.params.id;
    const roupas = await Roupa.obterPorId(id);
    return res.status(200).json(roupas);
  } catch (err) {
    console.error(err.message);
    return res.status(err.statusCode).json(err)
  }
});

//Buscar por nome
router.get("/:nome", async (req,res) => {
  try {
    const nome = req.params.nome;
    const roupas = await Roupa.obterPorNome(id);
    return res.status(200).json(roupas);
  } catch (err) {
    console.error(err.message);
    return res.status(err.statusCode).json(err)
  }
});

//Buscar por tamanho
router.get("/:tamanho", async (req,res) => {
  try {
    const tamanho = req.params.tamanho;
    const roupas = await Roupa.obterPorTamanho(tamanho);
    return res.status(200).json(roupas);
  } catch (err) {
    console.error(err.message);
    return res.status(err.statusCode).json(err)
  }
});

//Buscar por categoria
router.get("/:categoria", async (req,res) => {
  try {
    const categoria = req.params.categoria;
    const roupas = await Roupa.obterPorCategoria(categoria);
    return res.status(200).json(roupas);
  } catch (err) {
    console.error(err.message);
    return res.status(err.statusCode).json(err)
  }
});

// POST - Adicionar nova roupa com upload de imagem
router.post("/", upload.single("imagem"), async (req, res) => {
  try {
    const { nome, descricao, tamanho, categoria, preco_aluguel } = req.body;

    let imagem_url = "";
    if (req.file) {
      imagem_url = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }
    const roupa = await Roupa.criar({ nome, descricao, tamanho, categoria, preco_aluguel }, imagem_url);
    return res.status(201).json(roupa);
  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: "Erro no upload da imagem" });
  }
});

// PUT - Atualizar roupa
router.put("/:id", upload.single("imagem"), async (req, res) => {
  try {
    const { nome, descricao, tamanho, categoria, preco_aluguel, status } =
      req.body;
    const id = req.params.id;
    const imagemUrl = await Roupa.obterImagem(id) || "";
    
    if (req.file) {
      imagemUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const roupaAtualizada = await Roupa.atualizar(id, { nome, descricao, tamanho, categoria, preco_aluguel, status, imagemUrl })
    return res.status(200).json(roupaAtualizada);    
  } catch (error) {
    console.error("Erro ao atualizar roupa:", error);
    res.status(500).json({ error: "Erro ao atualizar roupa" });
  }
});

module.exports = router;
