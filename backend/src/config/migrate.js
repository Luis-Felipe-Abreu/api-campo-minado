require('dotenv').config();
const db = require('./db');
const SQL = `
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  data_nascimento DATE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  saldo NUMERIC(12,2) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS jogos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  valor_aposta NUMERIC(12,2) NOT NULL,
  tabuleiro JSONB NOT NULL,
  posicoes_reveladas JSONB NOT NULL DEFAULT '[]'::jsonb,
  diamantes_encontrados INTEGER NOT NULL DEFAULT 0,
  premio_atual NUMERIC(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'EM_ANDAMENTO',
  valor_ganho NUMERIC(12,2) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
  finalizado_em TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_jogos_usuario ON jogos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_jogos_status ON jogos(status);
`;
async function runMigrations() {
  await db.query(SQL);
  console.log('✅ Migrations executadas.');
}
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
module.exports = { runMigrations };
