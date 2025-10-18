const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://seusite.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

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

// Conectar ao banco
db.then(conn=> {
  conn.connect()
}).catch(err=>{
  console.error("Não foi possivel COnectar ao banco de dados! Error: ", err);
})

// Criar diretório uploads se não existir
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
});