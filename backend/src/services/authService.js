const bcrypt = require('bcrypt');
const userRepo = require('../repositories/userRepository');
const AppError = require('../utils/AppError');
const { validarSenha, validarEmail } = require('../utils/validators');
async function register({ nome, email, dataNascimento, senha, confirmacaoSenha }) {
  if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
    throw new AppError('Todos os campos são obrigatórios.', 400);
  }
  if (!validarEmail(email)) {
    throw new AppError('E-mail inválido.', 400);
  }
  if (senha !== confirmacaoSenha) {
    throw new AppError('A confirmação de senha não confere.', 400);
  }
  const erroSenha = validarSenha(senha);
  if (erroSenha) throw new AppError(erroSenha, 400);
  const existente = await userRepo.findByEmail(email);
  if (existente) throw new AppError('E-mail já cadastrado.', 409);
  const senhaHash = await bcrypt.hash(senha, 10);
  const user = await userRepo.create({ nome, email, dataNascimento, senhaHash });
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    dataNascimento: user.data_nascimento,
    saldo: Number(user.saldo),
  };
}
async function login({ email, senha }) {
  if (!email || !senha) throw new AppError('E-mail e senha são obrigatórios.', 400);
  const user = await userRepo.findByEmail(email);
  if (!user) throw new AppError('Credenciais inválidas.', 401);
  const ok = await bcrypt.compare(senha, user.senha_hash);
  if (!ok) throw new AppError('Credenciais inválidas.', 401);
  return {
    nome: user.nome,
    email: user.email,
    dataNascimento: user.data_nascimento,
  };
}
async function resetPassword({ id, novaSenha }) {
  if (!id || !novaSenha) throw new AppError('id e novaSenha são obrigatórios.', 400);
  const erroSenha = validarSenha(novaSenha);
  if (erroSenha) throw new AppError(erroSenha, 400);
  const user = await userRepo.findById(id);
  if (!user) throw new AppError('Usuário não encontrado.', 404);
  const igual = await bcrypt.compare(novaSenha, user.senha_hash);
  if (igual) throw new AppError('A nova senha não pode ser igual à senha atual.', 400);
  const novoHash = await bcrypt.hash(novaSenha, 10);
  await userRepo.updateSenha(id, novoHash);
  return { mensagem: 'Senha atualizada com sucesso.' };
}
module.exports = { register, login, resetPassword };