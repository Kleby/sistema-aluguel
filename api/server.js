const express = require('express');
const db = require('./config/database');
const path = require('path');
const Bot = require("./bot/Whatsapp.bot.js");
const corsMiddleware = require("./middleware/cors.js");
const morganMiddleware = require("./middleware/morgan.js");
const logger = require("./config/logger.js");
const aluguelCronJobs = require("./jobs/aluguel-cron.jobs.js");
const aluguelService = require("./services/aluguel.service.js");
require('dotenv').config();
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware cors
app.use(corsMiddleware);
//Middleware morgan
// app.use(morganMiddleware);

//Iniciar o Cro Jobs para atualizar o banco
aluguelCronJobs.iniciar();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Rotas públicas
app.use('/api/auth', require('./routes/auth'));

// Rotas protegidas
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/roupas', require('./routes/roupas'));
app.use('/api/alugueis', require('./routes/alugueis'));
app.use('/api/bot', require("./routes/bot-message"))

// Conectar ao banco
db.then(conn=> {
  conn.connect()
}).catch(err=>{
  logger.error("Não foi possivel COnectar ao banco de dados! Error: ", err);
})

//Iniciar o bot
// const bot = new Bot();


// Criar diretório uploads se não existir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.listen(PORT, () => {  
  aluguelService.atualizarAtrasados();
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
  logger.data(`📁 Uploads: http://localhost:${PORT}/uploads`);
});