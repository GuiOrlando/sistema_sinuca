const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const [stats] = await db.query(`
            SELECT
                COUNT(*) as totalClientes,
                SUM(valor_mensalidade) as receitaMensal
            FROM estabelecimentos
        `);

        res.json({
            totalClientes: stats[0].totalClientes || 0,
            receitaMensal: stats[0].receitaMensal || 0,
            totalMesas: 0
        });
    } catch (error) {
        console.error("Erro no SQL:", error);
        res.status(500).json({ error: "Erro interno no banco de dados: " + error.message });
    }
});

module.exports = router;