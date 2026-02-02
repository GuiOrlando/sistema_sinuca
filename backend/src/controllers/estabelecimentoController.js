const db = require('../config/db');

exports.listarBares = async (req, res) => {
    try {
        const query = `
            SELECT e.*, COUNT(m.id) as total_mesas 
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
};

exports.cadastrarBar = async (req, res) => {
    const { nome_fantasia, responsavel_nome, telefone, endereco, valor_mensalidade, quantidade_mesas, insumos } = req.body;
    
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

        if (insumos && Array.isArray(insumos) && insumos.length > 0) {
            const insumosArray = insumos.map(idInsumo => [novoBarId, idInsumo, 1, new Date()]);
            await db.query(
                'INSERT INTO entregas_insumos (id_estabelecimento, id_insumo, quantidade, data_entrega) VALUES ?',
                [insumosArray]
            );
        }

        res.status(201).json({ message: "Bar, mesas e insumos cadastrados com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao cadastrar bar" });
    }
};

exports.atualizarBar = async (req, res) => {
    const { id } = req.params;
    const { nome_fantasia, responsavel_nome, telefone, endereco, valor_mensalidade, insumos } = req.body;
    
    try {
        const [result] = await db.query(
            'UPDATE estabelecimentos SET nome_fantasia = ?, responsavel_nome = ?, telefone = ?, endereco = ?, valor_mensalidade = ? WHERE id = ?',
            [nome_fantasia, responsavel_nome, telefone, endereco, valor_mensalidade, id]
        );

        if (insumos && Array.isArray(insumos) && insumos.length > 0) {
            const insumosArray = insumos.map(idInsumo => [id, idInsumo, 1, new Date()]);
            await db.query(
                'INSERT INTO entregas_insumos (id_estabelecimento, id_insumo, quantidade, data_entrega) VALUES ?',
                [insumosArray]
            );
        }

        if (result.affectedRows === 0) return res.status(404).json({ error: "Não encontrado" });
        res.json({ message: "Bar atualizado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar bar" });
    }
};

exports.excluirBar = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM entregas_insumos WHERE id_estabelecimento = ?', [id]);
        await db.query('DELETE FROM mesas WHERE id_estabelecimento = ?', [id]);
        const [result] = await db.query('DELETE FROM estabelecimentos WHERE id = ?', [id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "Não encontrado" });
        res.json({ message: "Excluído com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir bar" });
    }
};