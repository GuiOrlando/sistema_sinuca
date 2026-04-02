const db = require('../config/db');

exports.listarPagamentos = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id, 
                p.valor, 
                p.data_vencimento, 
                p.data_pagamento,
                CASE 
                    WHEN p.status = 'Pendente' AND p.data_vencimento < CURDATE() THEN 'Atrasado'
                    ELSE p.status 
                END AS status,
                e.nome_fantasia AS nome_bar,
                p.id_estabelecimento
            FROM pagamentos p
            JOIN estabelecimentos e ON p.id_estabelecimento = e.id
            WHERE p.ativo = 1
            ORDER BY p.data_vencimento DESC
        `;
        
        const [rows] = await db.query(query);
        return res.json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error("Erro ao listar pagamentos:", error.message);
        return res.status(500).json({ error: "Erro interno ao buscar pagamentos" });
    }
};

exports.criarPagamento = async (req, res) => {
    const { id_estabelecimento, valor, data_vencimento, data_pagamento, status } = req.body;

    try {
        const query = `
            INSERT INTO pagamentos (id_estabelecimento, valor, data_vencimento, data_pagamento, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const dataPgtoFinal = data_pagamento || null;

        const [result] = await db.query(query, [
            id_estabelecimento, 
            valor, 
            data_vencimento, 
            dataPgtoFinal, 
            status || 'Pendente'
        ]);
        
        return res.status(201).json({ 
            message: "Pagamento registrado com sucesso!",
            id: result.insertId 
        });
    } catch (error) {
        console.error("Erro ao inserir pagamento:", error);
        return res.status(500).json({ error: "Erro ao registrar no banco de dados" });
    }
};

exports.excluirPagamento = async (req, res) => {
    const { id } = req.params;

    try {
        const query = "UPDATE pagamentos SET ativo = 0 WHERE id = ?";
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Pagamento não encontrado" });
        }

        return res.json({ message: "Pagamento removido com sucesso!" });
    } catch (error) {
        console.error("Erro ao excluir pagamento:", error.message);
        return res.status(500).json({ error: "Erro interno ao excluir pagamento" });
    }
}

exports.atualizarStatusPagamento = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        let query;
        let params;

        if (status === 'Pago') {
            const hoje = new Date().toISOString().split('T')[0];
            query = "UPDATE pagamentos SET status = ?, data_pagamento = ? WHERE id = ?";
            params = [status, hoje, id];
        } else {
            query = "UPDATE pagamentos SET status = ? WHERE id = ?";
            params = [status, id];
        }

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Pagamento não encontrado" });
        }

        return res.json({ message: "Status atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar status:", error.message);
        return res.status(500).json({ error: "Erro interno ao atualizar status" });
    }
};

exports.editarPagamento = async (req, res) => {
    const { id } = req.params;
    const { id_estabelecimento, valor, data_vencimento, data_pagamento, status } = req.body;

    try {
        const query = `
            UPDATE pagamentos 
            SET id_estabelecimento = ?, valor = ?, data_vencimento = ?, data_pagamento = ?, status = ?
            WHERE id = ?
        `;
        
        const [result] = await db.query(query, [
            id_estabelecimento, 
            valor, 
            data_vencimento, 
            data_pagamento || null, 
            status, 
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Pagamento não encontrado" });
        }

        return res.json({ message: "Pagamento atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao editar pagamento:", error);
        return res.status(500).json({ error: "Erro interno ao editar pagamento" });
    }
};