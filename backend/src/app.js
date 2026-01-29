const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();

const authRoutes = require('./routes/authRoutes');
const estabelecimentoRoutes = require('./routes/estabelecimentoRoutes');

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes)
app.use('/estabelecimentos', estabelecimentoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});