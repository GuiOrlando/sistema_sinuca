const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const query = `
            SELECT 
                e.*, 
                COUNT(m.id) as total_mesas 
            FROM estabelecimentos e
            LEFT JOIN mesas m ON e.id = m.id_estabelecimento
            GROUP BY e.id
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar bares" });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { nome_fantasia, responsavel_nome, telefone, endereco, valor_mensalidade, quantidade_mesas } = req.body;
    
    try {
        const [result] = await db.query(
            'INSERT INTO estabelecimentos (nome_fantasia, responsavel_nome, telefone, endereco, valor_mensalidade) VALUES (?, ?, ?, ?, ?)',
            [nome_fantasia, responsavel_nome, telefone, endereco, valor_mensalidade]
        );

        const novoBarId = result.insertId;

        if (quantidade_mesas && Number(quantidade_mesas) > 0) {
            const mesasArray = [];
            for (let i = 1; i <= Number(quantidade_mesas); i++) {
                mesasArray.push([`MESA-${novoBarId}-${i}`, 'Padrão', novoBarId]);
            }

            await db.query(
                'INSERT INTO mesas (numero_serie, modelo, id_estabelecimento) VALUES ?',
                [mesasArray]
            );
        }

        res.status(201).json({ message: "Bar e mesas cadastrados com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao cadastrar bar e mesas" });
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
        await db.query('DELETE FROM mesas WHERE id_estabelecimento = ?', [id]);
        
        const [result] = await db.query('DELETE FROM estabelecimentos WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Estabelecimento não encontrado" });
        }

        res.json({ message: "Bar e mesas excluídos com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir bar" });
    }
});

module.exports = router;