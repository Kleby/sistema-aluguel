const wppconnect = require("@wppconnect-team/wppconnect");
const logger = require("../config/logger.js");

class BotAluguel {
  client;

  constructor() {
    wppconnect
      .create({
        session: "Bot-session",
        headless: true,
        useChrome: true,
        debug: false,
      })
      .then((cli) => {
        this.client = cli;
        logger.info("🤖 Bot conectado com sucesso!");
        BotAluguel.startListening(cli);
      })
      .catch((err) => {
        logger.error(`❌ Erro ao iniciar o Bot! Error: `, err);
      });
  }

  static startListening(client) {
    client.onMessage(async (message) => {
      logger.data(`📩 Mensagem de ${message.from}: ${message.body}`);
      const msg = message.body.toLowerCase();   
      if (msg === "oi") {
        await client.sendText(
          message.from,
          `Olá 👋! Eu sou um bot feito com WPPConnect.`
        );
      } else if (msg.includes("horário")) {
        const hora = new Date().toLocaleTimeString("pt-BR");
        await client.sendText(message.from, `🕰️ Agora são ${hora}`);
      } else if (msg === "menu") {
        await client.sendText(
          message.from,
          `'📋 *Menu:*\n1️⃣ Saber o horário.\n2️⃣ Falar com atendente.\n3️⃣ Saber mais sobre o bot'`
        );
      }
    });
  }
}

module.exports = BotAluguel;
