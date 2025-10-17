const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Aplicar autenticação em todas as rotas
router.use(authMiddleware);

// GET - Listar todos os aluguéis
router.get('/', (req, res) => {
  const sql = `
    SELECT a.*, c.nome as cliente_nome, r.nome as roupa_nome, r.imagem_url
    FROM alugueis a 
    JOIN clientes c ON a.cliente_id = c.id 
    JOIN roupas r ON a.roupa_id = r.id
    ORDER BY a.data_aluguel DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST - Criar novo aluguel
router.post('/', (req, res) => {
  const { cliente_id, roupa_id, data_aluguel, data_devolucao_prevista, valor_total } = req.body;
  const usuario_id = req.user.id;
  
  const sql = `
    INSERT INTO alugueis (cliente_id, roupa_id, data_aluguel, data_devolucao_prevista, valor_total, usuario_id) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(sql, [cliente_id, roupa_id, data_aluguel, data_devolucao_prevista, valor_total, usuario_id], (err, results) => {
    if (err) throw err;
    
    // Atualizar status da roupa para "alugado"
    const updateRoupa = 'UPDATE roupas SET status = "alugado" WHERE id = ?';
    db.query(updateRoupa, [roupa_id], (err) => {
      if (err) throw err;
      res.json({ message: 'Aluguel realizado com sucesso!', id: results.insertId });
    });
  });
});

module.exports = router;