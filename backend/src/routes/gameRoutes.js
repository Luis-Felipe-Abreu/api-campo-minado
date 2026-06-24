const { Router } = require('express');
const ctrl = require('../controllers/gameController');
const router = Router();
router.post('/start', ctrl.start);
router.post('/:gameId/reveal', ctrl.reveal);
router.post('/:gameId/cashout', ctrl.cashout);
module.exports = router;
 