const gameService = require('../services/gameService');
async function start(req, res, next) {
  try {
    const data = await gameService.start(req.body);
    res.status(201).json(data);
  } catch (e) { next(e); }
}
async function reveal(req, res, next) {
  try {
    const data = await gameService.reveal(Number(req.params.gameId), req.body);
    res.json(data);
  } catch (e) { next(e); }
}
async function cashout(req, res, next) {
  try {
    const data = await gameService.cashout(Number(req.params.gameId));
    res.json(data);
  } catch (e) { next(e); }
}
module.exports = { start, reveal, cashout }; 