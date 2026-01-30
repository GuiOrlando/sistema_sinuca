const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM estabelecimentos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar bares" });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { nome_fantasia, responsavel_nome, telefone, endereco, valor_mensalidade } = req.body;
    try {
        await db.query(
            'INSERT INTO estabelecimentos (nome_fantasia, responsavel_nome, telefone, endereco, valor_mensalidade) VALUES (?, ?, ?, ?, ?)',
            [nome_fantasia, responsavel_nome, telefone, endereco, valor_mensalidade]
        );
        res.status(201).json({ message: "Bar cadastrado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar bar" });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { nome_fantasia, responsavel_nome, telefone, endereco, valor_mensalidade } = req.body;
    
    try {
        const [result] = await db.query(
            'UPDATE estabelecimentos SET nome_fantasia = ?, responsavel_nome = ?, telefone = ?, endereco = ?, valor_mensalidade = ? WHERE id = ?',
            [nome_fantasia, responsavel_nome, telefone, endereco, valor_mensalidade, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Estabelecimento não encontrado" });
        }

        res.json({ message: "Bar atualizado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar bar" });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM estabelecimentos WHERE id = ?', [id]);
        res.json({ message: "Bar excluído com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir bar" });
    }
});

module.exports = router;