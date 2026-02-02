const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const insumoController = require('../controllers/insumoController');

router.get('/', authMiddleware, insumoController.listarInsumos);
router.post('/', authMiddleware, insumoController.cadastrarInsumo);
router.put('/:id', authMiddleware, insumoController.atualizarInsumo);
router.delete('/:id', authMiddleware, insumoController.excluirInsumo);

module.exports = router;