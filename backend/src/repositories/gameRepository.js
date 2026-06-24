const db = require('../config/db');
async function create({ usuarioId, valorAposta, tabuleiro }) {
  const { rows } = await db.query(
    `INSERT INTO jogos (usuario_id, valor_aposta, tabuleiro)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [usuarioId, valorAposta, JSON.stringify(tabuleiro)]
  );
  return rows[0];
}
async function findById(id) {
  const { rows } = await db.query('SELECT * FROM jogos WHERE id = $1', [id]);
  return rows[0];
}
async function findActiveByUser(usuarioId) {
  const { rows } = await db.query(
    `SELECT * FROM jogos WHERE usuario_id = $1 AND status = 'EM_ANDAMENTO' LIMIT 1`,
    [usuarioId]
  );
  return rows[0];
}
async function updateProgresso(id, { posicoesReveladas, diamantesEncontrados, premioAtual }) {
  const { rows } = await db.query(
    `UPDATE jogos
       SET posicoes_reveladas = $1,
           diamantes_encontrados = $2,
           premio_atual = $3
     WHERE id = $4
     RETURNING *`,
    [JSON.stringify(posicoesReveladas), diamantesEncontrados, premioAtual, id]
  );
  return rows[0];
}
async function finalizar(id, { status, valorGanho }) {
  const { rows } = await db.query(
    `UPDATE jogos
       SET status = $1,
           valor_ganho = $2,
           finalizado_em = NOW()
     WHERE id = $3
     RETURNING *`,
    [status, valorGanho, id]
  );
  return rows[0];
}
module.exports = {
  create,
  findById,
  findActiveByUser,
  updateProgresso,
  finalizar,
};