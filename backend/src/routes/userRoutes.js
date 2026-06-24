const { Router } = require('express');
const ctrl = require('../controllers/userController');
const router = Router();
// dashboard precisa vir antes de /:id para não conflitar
router.get('/dashboard', ctrl.dashboard);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.atualizarSaldo);
router.delete('/:id', ctrl.remover);
module.exports = router;
 