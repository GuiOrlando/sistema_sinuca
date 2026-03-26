const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, pagamentoController.listarPagamentos);
router.post('/', authMiddleware, pagamentoController.criarPagamento);

module.exports = router;