const userRepo = require('../repositories/userRepository');
const AppError = require('../utils/AppError');
async function getById(id) {
  const user = await userRepo.findById(id);
  if (!user) throw new AppError('Usuário não encontrado.', 404);
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    saldo: Number(user.saldo),
  };
}
async function getDashboard(usuarioId) {
  if (!usuarioId) throw new AppError('idUser é obrigatório (query param).', 400);
  const user = await userRepo.findById(usuarioId);
  if (!user) throw new AppError('Usuário não encontrado.', 404);
  const d = await userRepo.getDashboard(usuarioId);
  return {
    totalJogos: d.total_jogos,
    vitorias: d.vitorias,
    derrotas: d.derrotas,
    valorGanho: Number(d.valor_ganho.toFixed(2)),
    valorPerdido: Number(d.valor_perdido.toFixed(2)),
  };
}
async function atualizarSaldo(id, saldo) {
  if (saldo === undefined || saldo === null) {
    throw new AppError('Campo saldo é obrigatório.', 400);
  }
  const valor = Number(saldo);
  if (Number.isNaN(valor)) throw new AppError('Saldo deve ser numérico.', 400);
  if (valor < 0) throw new AppError('Não é permitido cadastrar saldo negativo.', 400);
  const valorFormatado = Math.round(valor * 100) / 100;
  const user = await userRepo.findById(id);
  if (!user) throw new AppError('Usuário não encontrado.', 404);
  const atualizado = await userRepo.updateSaldo(id, valorFormatado);
  return {
    id: atualizado.id,
    nome: atualizado.nome,
    email: atualizado.email,
    saldo: Number(atualizado.saldo),
  };
}
async function remover(id) {
  const ok = await userRepo.deleteById(id);
  if (!ok) throw new AppError('Usuário não encontrado.', 404);
  return { mensagem: 'Usuário e jogos vinculados excluídos com sucesso.' };
}
module.exports = { getById, getDashboard, atualizarSaldo, remover };