const authService = require('../services/authService');
async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (e) { next(e); }
}
async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (e) { next(e); }
}
async function resetPassword(req, res, next) {
  try {
    const data = await authService.resetPassword(req.body);
    res.json(data);
  } catch (e) { next(e); }
}
module.exports = { register, login, resetPassword }; 