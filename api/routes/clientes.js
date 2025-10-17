const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Aplicar autenticação em todas as rotas de clientes
router.use(authMiddleware);

// GET - Listar todos os clientes (apenas admin)
router.get('/', adminMiddleware, (req, res) => {
  const sql = 'SELECT * FROM clientes ORDER BY nome';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar clientes:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    res.json(results);
  });
});

// GET - Buscar cliente por ID (apenas admin)
router.get('/:id', adminMiddleware, (req, res) => {
  const sql = 'SELECT * FROM clientes WHERE id = ?';
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar cliente:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(results[0]);
  });
});

// POST - Criar novo cliente (apenas admin)
router.post('/', adminMiddleware, (req, res) => {
  const { nome, email, telefone, cpf, endereco } = req.body;

  // Validações
  if (!nome || !email || !cpf) {
    return res.status(400).json({ error: 'Nome, email e CPF são obrigatórios' });
  }

  const sql = 'INSERT INTO clientes (nome, email, telefone, cpf, endereco) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [nome, email, telefone, cpf, endereco], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'CPF ou Email já cadastrado' });
      }
      console.error('Erro ao criar cliente:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    res.status(201).json({ 
      message: 'Cliente cadastrado com sucesso!', 
      id: results.insertId 
    });
  });
});

// PUT - Atualizar cliente (apenas admin)
router.put('/:id', adminMiddleware, (req, res) => {
  const { nome, email, telefone, cpf, endereco } = req.body;

  if (!nome || !email || !cpf) {
    return res.status(400).json({ error: 'Nome, email e CPF são obrigatórios' });
  }

  const sql = 'UPDATE clientes SET nome=?, email=?, telefone=?, cpf=?, endereco=? WHERE id=?';
  
  db.query(sql, [nome, email, telefone, cpf, endereco, req.params.id], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'CPF ou Email já está em uso por outro cliente' });
      }
      console.error('Erro ao atualizar cliente:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json({ message: 'Cliente atualizado com sucesso!' });
  });
});

module.exports = router;