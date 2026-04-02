const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, pagamentoController.listarPagamentos);
router.post('/', authMiddleware, pagamentoController.criarPagamento);
router.delete('/:id', authMiddleware, pagamentoController.excluirPagamento);
router.patch('/:id', authMiddleware, pagamentoController.atualizarStatusPagamento);
router.put('/:id', authMiddleware, pagamentoController.editarPagamento);

module.exports = router;