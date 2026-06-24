module.exports = function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    erro: err.message || 'Erro interno do servidor',
  });
}; 