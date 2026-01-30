const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM insumos ORDER BY nome ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar materiais" });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { nome, unidade_medida, quantidade_estoque, preco_custo } = req.body;
    try {
        await db.query(
            'INSERT INTO insumos (nome, unidade_medida, quantidade_estoque, preco_custo) VALUES (?, ?, ?, ?)',
            [nome, unidade_medida, quantidade_estoque || 0, preco_custo || 0]
        );
        res.status(201).json({ message: "Material cadastrado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao cadastrar material" });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { nome, unidade_medida, quantidade_estoque, preco_custo } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE insumos SET nome = ?, unidade_medida = ?, quantidade_estoque = ?, preco_custo = ? WHERE id = ?',
            [nome, unidade_medida, quantidade_estoque, preco_custo, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Material não encontrado" });
        }

        res.json({ message: "Material atualizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar material" });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        // Nota: Isso pode falhar se houver entregas registradas para este insumo (FK constraint)
        await db.query('DELETE FROM insumos WHERE id = ?', [id]);
        res.json({ message: "Material removido com sucesso!" });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: "Não é possível excluir: existem entregas registradas para este material." });
        }
        res.status(500).json({ error: "Erro ao excluir material" });
    }
});

module.exports = router;