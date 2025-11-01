const cron = require("node-cron");
const aluguelService = require("../services/aluguel.service.js");
const logger = require("../config/logger.js");
const fs = require("fs");
const path = require("path");

class AluguelCronJobs {
  static iniciar() {
    logger.info("Iniciando o Cron Jobs para sicronizar o banco de dados");
    cron.schedule("0 6 * * *", async () => {
      logger.info("🕒 Executando atualização diária de aluguéis atrasados...");

      try {
        const result = await aluguelService.atualizarAtrasados();
      } catch (err) {
        logger.error("❌ Erro no cron job: ", err.message);
      }
    });
    // cron.schedule("0 7 1 1,7 *", async () => {
    //   const dir = path.join(__dirname, "../", "logs");
    //   fs.createWriteStream(path.join(dir, "combined.log")), { data: "utf8" };
    //   fs.createWriteStream(path.join(dir, "error.log")), { data: "utf8" };
    // });
  }
}

module.exports = AluguelCronJobs;
