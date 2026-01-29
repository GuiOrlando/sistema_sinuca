const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste de conexão
app.get('/teste-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT "Conexão ativa!" as status');
        res.json({ message: "Banco de dados conectado com sucesso!", data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao conectar no banco de dados" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});