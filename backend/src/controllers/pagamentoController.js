const db = require('../config/db');

exports.listarPagamentos = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id, 
                p.valor, 
                p.data_vencimento, 
                p.status, 
                e.nome_fantasia AS nome_bar
            FROM pagamentos p
            JOIN estabelecimentos e ON p.id_estabelecimento = e.id
            ORDER BY p.data_vencimento DESC
        `;
        
        const [rows] = await db.query(query);
        return res.json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error("Erro ao listar pagamentos no banco:", error.message);
        
        return res.status(500).json({ 
            error: "Erro interno ao buscar pagamentos",
            details: error.message 
        });
    }
};

exports.criarPagamento = async (req, res) => {
    const { id_estabelecimento, valor, data_vencimento, status } = req.body;

    try {
        const query = `
            INSERT INTO pagamentos (id_estabelecimento, valor, data_vencimento, status)
            VALUES (?, ?, ?, ?)
        `;
        
        const [result] = await db.query(query, [id_estabelecimento, valor, data_vencimento, status || 'Pendente']);
        
        return res.status(201).json({ 
            message: "Pagamento registrado com sucesso!",
            id: result.insertId 
        });
    } catch (error) {
        console.error("Erro ao inserir pagamento:", error);
        return res.status(500).json({ error: "Erro ao registrar pagamento" });
    }
};
