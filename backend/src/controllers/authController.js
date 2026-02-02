const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { nome, email, senha } = req.body; //

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);

        await db.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, hashedPassword]
        );

        res.status(201).json({ message: "Usuário master criado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body; //

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: "E-mail ou senha inválidos" });
        }

        const usuario = rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: "E-mail ou senha inválidos" });
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome },
            process.env.JWT_SECRET || 'chave_secreta_tcc_sinuca',
            { expiresIn: '24h' }
        );

        res.json({ 
            token, 
            user: { id: usuario.id, nome: usuario.nome, email: usuario.email } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};