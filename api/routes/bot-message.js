const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const Bot = require("../bot/Whatsapp.bot.js");
const BotMensagem = require("../models/repository/BotMessage.repository.js");
const logger = require("../config/logger.js");
const bot = new Bot();

// Aplicar autenticação em todas as rotas
router.use(authMiddleware);

router.post("/enviar-mensagem", adminMiddleware, async (req, res) => {
  try {
    const { para, mensagem_id } =  await req.body;

    if (!bot.client) {
      return res.status(503).json({
        status: "error",
        message: "O bot ainda não está conectado ao WhatsApp.",
      });
    }
    const mensagem = await BotMensagem.obterPorId(mensagem_id);
    await bot.client.sendText(para, mensagem);
    return res.status(200).json({
      status: "success",
      message: "Mensagem enviada",
    });
  } catch (err) {
    logger.error("Erro ao enviar mensagem no wpp. Error: ", err);
    return res.status(500).json({
      status: "error",
      message: "Error ao enviar mensagme via bot",
    });
  }
});

router.post("/criar-mensagem", adminMiddleware, async(req, res) => {
    try {
        const novaMensagem = await BotMensagem.criar(req.body.mensagem);
        return res.status(201).json(novaMensagem);
    } catch (err) {
        logger.error("Error: ", err.message);
        return res.status(500).json(err);
    }
})

router.get("/mensagens", adminMiddleware, async(req, res) =>{
    try {
        const mensagens = await BotMensagem.obterTodas();
        return res.status(200).json(mensagens);
    } catch (err) {
        logger.error(err.message);
        return res.status(500).json(err);
    }
});

router.get("/mensagens/:id", adminMiddleware, async(req, res)=>{
    try {
        const mensagem = await BotMensagem.obterPorId(req.body.id);
        return res.status(200).json(mensagem)
    } catch (err) {
        logger.error(err.message);
        return res.status(500).json(err);
    }
})


module.exports = router;