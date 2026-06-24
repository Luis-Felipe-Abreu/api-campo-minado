const userService = require('../services/userService');
async function getById(req, res, next) {
  try {
    const data = await userService.getById(Number(req.params.id));
    res.json(data);
  } catch (e) { next(e); }
}
async function dashboard(req, res, next) {
  try {
    const idUser = Number(req.query.idUser || req.query.id);
    const data = await userService.getDashboard(idUser);
    res.json(data);
  } catch (e) { next(e); }
}
async function atualizarSaldo(req, res, next) {
  try {
    const data = await userService.atualizarSaldo(Number(req.params.id), req.body.saldo);
    res.json(data);
  } catch (e) { next(e); }
}
async function remover(req, res, next) {
  try {
    const data = await userService.remover(Number(req.params.id));
    res.json(data);
  } catch (e) { next(e); }
}
module.exports = { getById, dashboard, atualizarSaldo, remover }; 