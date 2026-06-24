require('dotenv').config();
const app = require('./app');
const { runMigrations } = require('./config/migrate');
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Falha ao iniciar a aplicação:', err);
    process.exit(1);
  }
})();