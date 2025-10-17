const express = require('express');
const router = express.Router();
const db = require('../config/database');
const upload = require('../config/upload');
const { authMiddleware } = require('../middleware/auth');

// Aplicar autenticação em todas as rotas
router.use(authMiddleware);

// GET - Listar todas as roupas
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM roupas ORDER BY nome';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// GET - Buscar roupa por ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM roupas WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// POST - Adicionar nova roupa com upload de imagem
router.post('/', upload.single('imagem'), (req, res) => {
  try {
    const { nome, descricao, tamanho, categoria, preco_aluguel } = req.body;
    
    let imagem_url = '';
    if (req.file) {
      imagem_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const sql = 'INSERT INTO roupas (nome, descricao, tamanho, categoria, preco_aluguel, imagem_url) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [nome, descricao, tamanho, categoria, parseFloat(preco_aluguel), imagem_url], (err, results) => {
      if (err) {
        console.error('Erro ao inserir roupa:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar roupa' });
      }
      res.json({ 
        message: 'Roupa adicionada com sucesso!', 
        id: results.insertId,
        imagem_url: imagem_url
      });
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro no upload da imagem' });
  }
});

// PUT - Atualizar roupa
router.put('/:id', upload.single('imagem'), (req, res) => {
  try {
    const { nome, descricao, tamanho, categoria, preco_aluguel, status } = req.body;
    
    const getSql = 'SELECT imagem_url FROM roupas WHERE id = ?';
    db.query(getSql, [req.params.id], (err, results) => {
      if (err) throw err;
      
      let imagem_url = results[0]?.imagem_url || '';
      
      if (req.file) {
        imagem_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
      
      const updateSql = 'UPDATE roupas SET nome=?, descricao=?, tamanho=?, categoria=?, preco_aluguel=?, status=?, imagem_url=? WHERE id=?';
      
      db.query(updateSql, [nome, descricao, tamanho, categoria, preco_aluguel, status, imagem_url, req.params.id], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Roupa atualizada com sucesso!' });
      });
    });
  } catch (error) {
    console.error('Erro ao atualizar roupa:', error);
    res.status(500).json({ error: 'Erro ao atualizar roupa' });
  }
});

module.exports = router;