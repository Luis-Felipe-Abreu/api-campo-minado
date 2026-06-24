function validarSenha(senha) {
  if (typeof senha !== 'string' || senha.length < 8) {
    return 'A senha deve possuir no mínimo 8 caracteres.';
  }
  if (!/[A-Z]/.test(senha)) {
    return 'A senha deve conter pelo menos uma letra maiúscula.';
  }
  if (!/[0-9]/.test(senha)) {
    return 'A senha deve conter pelo menos um número.';
  }
  if (!/[^A-Za-z0-9]/.test(senha)) {
    return 'A senha deve conter pelo menos um caractere especial.';
  }
  return null;
}
function validarEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
module.exports = { validarSenha, validarEmail };
