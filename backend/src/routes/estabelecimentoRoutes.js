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

module.exports = router;