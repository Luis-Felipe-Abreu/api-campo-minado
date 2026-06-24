const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'API Campo Minado - online' });
});
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/games', gameRoutes);
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});
app.use(errorHandler);
module.exports = app;