const express = require("express");
const router = express.Router();
const Roupa = require("../models/repository/Roupa.repository.js");
const roupaOptionsService = require("../services/roupa-options.service.js");
const upload = require("../config/upload");
const { authMiddleware } = require("../middleware/auth");
const logger = require("../config/logger.js");

// Aplicar autenticação em todas as rotas
router.use(authMiddleware);

// GET - Listar todas as roupas
router.get("/", async (req, res) => {
  try {
    const orderBy = req.query.orderBy ?? "rp.nome";
    const roupas = await Roupa.obterTodos(orderBy);

    return res.status(200).json(roupas);
  } catch (err) {
    logger.error(err.message);
    return res.status(err.statusCode).json(err);
  }
});

// Buscar por id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const roupa = await Roupa.obterPorId(id);
    return res.status(200).json(roupa);
  } catch (err) {
    logger.error(err.message);
    return res.status(err.statusCode).json(err);
  }
});

router.delete("/:id", async (req, res)=>{
    try {
    const id = req.params.id;
    const roupa = await Roupa.deletar(id);
    return res.status(200).json(roupa);
  } catch (err) {
    logger.error(err.message);
    return res.status(err.statusCode).json(err);
  }
})

//Buscar por nome
router.get("/nome/:nome", async (req, res) => {
  try {
    const nome = req.params.nome;
    const roupas = await Roupa.obterPorNome(id);
    return res.status(200).json(roupas);
  } catch (err) {
    logger.error(err.message);
    return res.status(err.statusCode).json(err);
  }
});

//Buscar por tamanho
router.get("/tamanho/:tamanho", async (req, res) => {
  try {
    const tamanho = req.params.tamanho;
    const roupas = await Roupa.obterPorTamanho(tamanho);
    return res.status(200).json(roupas);
  } catch (err) {
    logger.error(err.message);
    return res.status(err.statusCode).json(err);
  }
});

// POST - Adicionar nova roupa com upload de imagem
router.post("/", upload.single("imagem"), async (req, res) => {
  try {
    const {
      nome,
      descricao,
      tamanho_id,
      categoria_id,
      preco_aluguel,
      preco_compra,
      quantidade,
    } = req.body;

    let imagem_url = "";
    if (req.file) {
      imagem_url = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }
    const roupa = await Roupa.criar(
      {
        nome,
        descricao,
        tamanho_id,
        categoria_id,
        preco_aluguel,
        preco_compra,
        quantidade,
      },
      imagem_url
    );
    return res.status(201).json(roupa);
  } catch (error) {
    logger.error("Erro no upload:", error);
    res.status(500).json({ error: "Erro no upload da imagem" });
  }
});

// PUT - Atualizar roupa
router.put("/:id", upload.single("imagem"), async (req, res) => {
  try {
    const {
      nome,
      descricao,
      tamanho_id,
      categoria_id,
      preco_compra,
      preco_aluguel,
      quantidade,
      status,
    } = req.body;

    if (!nome || !descricao || !preco_compra || !quantidade || !preco_aluguel) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    console.log("ok");
    

    console.log("nome", nome)
      console.log("desci ",descricao)
      console.log("tama ",tamanho_id)
      console.log("cat ",categoria_id)
      console.log("compra ",preco_compra)
      console.log("aluguel ",preco_aluguel)
      console.log("qtd ",quantidade)
      console.log("status ",status)
    
    const id = req.params.id;
    let imagem_url = (await Roupa.obterImagem(id)) || "";

    if (req.file) {
      imagem_url = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }


    const roupaAtualizada = await Roupa.atualizar(id, {
      nome,
      descricao,
      tamanho_id,
      categoria_id,
      preco_aluguel,
      preco_compra,
      quantidade,
      status,
      imagem_url,
    });
    return res.status(200).json(roupaAtualizada);
  } catch (error) {
    logger.error("Erro ao atualizar roupa:", error);
    res.status(500).json({ error: "Erro ao atualizar roupa" });
  }
});
// Get - Obter categorias
router.get("/opcoes/categorias", async (req, res) => {
  try {
    const categorias = await roupaOptionsService.obterCategorias();
    return res.status(200).json(categorias);
  } catch (err) {
    logger.error(err);
    return res.status(500).json(err.message);
  }
});

// Get - Obter tamanhos
router.get("/opcoes/tamanhos", async (req, res) => {
  try {
    const tamanhos = await roupaOptionsService.obterTamanhos();
    return res.status(200).json(tamanhos);
  } catch (err) {
    logger.error(err);
    return res.status(500).json(err.message);
  }
});
// Get - Obter categoria por id
router.get("/opcoes/categorias/:id", async (req, res) => {
  try {
    const categoria = await roupaOptionsService.obterCategoriaPorId(
      req.params.id
    );
    return res.status(200).json(categoria);
  } catch (err) {
    logger.error(err);
    return res.status(500).json(err.message);
  }
});

// Get - Obter tamanho por id
router.get("/opcoes/tamanhos", async (req, res) => {
  try {
    const tamanho = await roupaOptionsService.obterTamanhoPorId(req.params.id);
    return res.status(200).json(tamanho);
  } catch (err) {
    logger.error(err);
    return res.status(500).json(err.message);
  }
});

module.exports = router;
