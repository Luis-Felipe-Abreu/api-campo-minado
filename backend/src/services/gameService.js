const userRepo = require('../repositories/userRepository');
const gameRepo = require('../repositories/gameRepository');
const AppError = require('../utils/AppError');
const TAMANHO = 5;
const QTD_BOMBAS = 5;
function gerarTabuleiro() {
  const tab = Array.from({ length: TAMANHO }, () =>
    Array.from({ length: TAMANHO }, () => 'DIAMANTE')
  );
  let colocadas = 0;
  while (colocadas < QTD_BOMBAS) {
    const l = Math.floor(Math.random() * TAMANHO);
    const c = Math.floor(Math.random() * TAMANHO);
    if (tab[l][c] !== 'BOMBA') {
      tab[l][c] = 'BOMBA';
      colocadas++;
    }
  }
  return tab;
}
function calcularPremio(valorAposta, diamantes) {
  const v = Number(valorAposta) * (1 + diamantes * 0.33);
  return Math.round(v * 100) / 100;
}
async function start({ idUser, valorAposta }) {
  if (!idUser || !valorAposta) {
    throw new AppError('idUser e valorAposta são obrigatórios.', 400);
  }
  const valor = Number(valorAposta);
  if (Number.isNaN(valor) || valor <= 0) {
    throw new AppError('valorAposta deve ser positivo.', 400);
  }
  const user = await userRepo.findById(idUser);
  if (!user) throw new AppError('Usuário não encontrado.', 404);
  const ativa = await gameRepo.findActiveByUser(idUser);
  if (ativa) {
    throw new AppError(
      'Você já possui uma partida em andamento. Finalize-a antes de iniciar outra.',
      400
    );
  }
  if (Number(user.saldo) < valor) {
    throw new AppError('Saldo insuficiente para realizar a aposta.', 400);
  }
  const novoSaldo = Math.round((Number(user.saldo) - valor) * 100) / 100;
  await userRepo.updateSaldo(idUser, novoSaldo);
  const tabuleiro = gerarTabuleiro();
  const jogo = await gameRepo.create({ usuarioId: idUser, valorAposta: valor, tabuleiro });
  return { gameId: jogo.id };
}
async function reveal(gameId, { linha, coluna }) {
  if (linha === undefined || coluna === undefined) {
    throw new AppError('linha e coluna são obrigatórios.', 400);
  }
  if (
    !Number.isInteger(linha) ||
    !Number.isInteger(coluna) ||
    linha < 0 || linha >= TAMANHO ||
    coluna < 0 || coluna >= TAMANHO
  ) {
    throw new AppError(`Posição inválida. Use valores inteiros entre 0 e ${TAMANHO - 1}.`, 400);
  }
  const jogo = await gameRepo.findById(gameId);
  if (!jogo) throw new AppError('Partida não encontrada.', 404);
  if (jogo.status !== 'EM_ANDAMENTO') {
    throw new AppError('Esta partida já foi finalizada.', 400);
  }
  const reveladas = jogo.posicoes_reveladas || [];
  const jaEscolhida = reveladas.some((p) => p.linha === linha && p.coluna === coluna);
  if (jaEscolhida) {
    throw new AppError('Posição já escolhida. Selecione outra posição.', 400);
  }
  const tabuleiro = jogo.tabuleiro;
  const conteudo = tabuleiro[linha][coluna];
  const novasReveladas = [...reveladas, { linha, coluna, conteudo }];
  if (conteudo === 'BOMBA') {
    await gameRepo.updateProgresso(gameId, {
      posicoesReveladas: novasReveladas,
      diamantesEncontrados: jogo.diamantes_encontrados,
      premioAtual: 0,
    });
    await gameRepo.finalizar(gameId, { status: 'PERDIDO', valorGanho: 0 });
    return { resultado: 'BOMBA', status: 'PERDIDO' };
  }
  const diamantes = jogo.diamantes_encontrados + 1;
  const premio = calcularPremio(jogo.valor_aposta, diamantes);
  await gameRepo.updateProgresso(gameId, {
    posicoesReveladas: novasReveladas,
    diamantesEncontrados: diamantes,
    premioAtual: premio,
  });
  return {
    resultado: 'DIAMANTE',
    diamantesEncontrados: diamantes,
    premioAtual: premio,
  };
}
async function cashout(gameId) {
  const jogo = await gameRepo.findById(gameId);
  if (!jogo) throw new AppError('Partida não encontrada.', 404);
  if (jogo.status !== 'EM_ANDAMENTO') {
    throw new AppError('Esta partida já foi finalizada.', 400);
  }
  if (jogo.diamantes_encontrados === 0) {
    throw new AppError('É preciso revelar ao menos um diamante antes de sacar.', 400);
  }
  const premio = Number(jogo.premio_atual);
  const user = await userRepo.findById(jogo.usuario_id);
  const novoSaldo = Math.round((Number(user.saldo) + premio) * 100) / 100;
  await userRepo.updateSaldo(jogo.usuario_id, novoSaldo);
  const finalizado = await gameRepo.finalizar(gameId, { status: 'GANHO', valorGanho: premio });
  return {
    gameId: finalizado.id,
    status: 'GANHO',
    valorSacado: premio,
    novoSaldo,
  };
}
module.exports = { start, reveal, cashout };