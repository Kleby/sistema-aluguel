const express = require('express');
const cors = require('cors');
const db = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/roupas', require('./routes/roupas'));
app.use('/api/alugueis', require('./routes/alugueis'));

// Testar conexão com banco
db.connect((err) => {
  if (err) {
    console.error('Erro conectando ao banco:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});