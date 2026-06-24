const db = require('../config/db');
async function create({ nome, email, dataNascimento, senhaHash }) {
  const { rows } = await db.query(
    `INSERT INTO usuarios (nome, email, data_nascimento, senha_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, email, data_nascimento, saldo`,
    [nome, email, dataNascimento, senhaHash]
  );
  return rows[0];
}
async function findByEmail(email) {
  const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return rows[0];
}
async function findById(id) {
  const { rows } = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return rows[0];
}
async function updateSenha(id, senhaHash) {
  await db.query('UPDATE usuarios SET senha_hash = $1 WHERE id = $2', [senhaHash, id]);
}
async function updateSaldo(id, saldo) {
  const { rows } = await db.query(
    'UPDATE usuarios SET saldo = $1 WHERE id = $2 RETURNING id, nome, email, saldo',
    [saldo, id]
  );
  return rows[0];
}
async function deleteById(id) {
  const { rowCount } = await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
  return rowCount > 0;
}
async function getDashboard(usuarioId) {
  const { rows } = await db.query(
    `SELECT
       COUNT(*)::int AS total_jogos,
       COUNT(*) FILTER (WHERE status = 'GANHO')::int AS vitorias,
       COUNT(*) FILTER (WHERE status = 'PERDIDO')::int AS derrotas,
       COALESCE(SUM(valor_ganho) FILTER (WHERE status = 'GANHO'), 0)::float AS valor_ganho,
       COALESCE(SUM(valor_aposta) FILTER (WHERE status = 'PERDIDO'), 0)::float AS valor_perdido
     FROM jogos
     WHERE usuario_id = $1 AND status IN ('GANHO','PERDIDO')`,
    [usuarioId]
  );
  return rows[0];
}
module.exports = {
  create,
  findByEmail,
  findById,
  updateSenha,
  updateSaldo,
  deleteById,
  getDashboard,
};
