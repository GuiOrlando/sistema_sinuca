const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        const [estabStats] = await db.query(`
            SELECT
                COUNT(*) as totalClientes,
                SUM(valor_mensalidade) as receitaMensal
            FROM estabelecimentos
        `);

        const [mesasStats] = await db.query('SELECT COUNT(*) as totalMesas FROM mesas');

        res.json({
            totalClientes: estabStats[0].totalClientes || 0,
            receitaMensal: estabStats[0].receitaMensal || 0,
            totalMesas: mesasStats[0].totalMesas || 0
        });
    } catch (error) {
        console.error("Erro no SQL do Dashboard:", error);
        res.status(500).json({ 
            error: "Erro interno no banco de dados: " + error.message 
        });
    }
};