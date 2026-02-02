const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const estController = require('../controllers/estabelecimentoController');

router.get('/', authMiddleware, estController.listarBares);
router.post('/', authMiddleware, estController.cadastrarBar);
router.post('/:id/insumos', authMiddleware, estController.registrarEntrega);
router.put('/:id', authMiddleware, estController.atualizarBar);
router.delete('/:id', authMiddleware, estController.excluirBar);

module.exports = router;