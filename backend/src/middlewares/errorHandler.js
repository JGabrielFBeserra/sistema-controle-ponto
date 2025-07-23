import Logger from './logger.js';

// Middleware de tratamento de erros
export const errorHandler = (err, req, res, next) => {
  // Log do erro
  Logger.error(`Erro na rota ${req.method} ${req.path}`, {
    message: err.message,
    stack: err.stack
  });

  // Erro do Zod (validação)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Erro do Prisma - Registro duplicado
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Registro já existe',
      campo: err.meta?.target?.[0],
      details: `O campo ${err.meta?.target?.[0]} já está sendo usado`
    });
  }

  // Erro do Prisma - Registro não encontrado
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro não encontrado',
      details: 'O item solicitado não foi encontrado no banco de dados'
    });
  }

  // Erro do Prisma - Chave estrangeira
  if (err.code === 'P2003') {
    return res.status(400).json({
      error: 'Violação de relacionamento',
      details: 'Não é possível executar esta operação devido a dependências'
    });
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      details: 'Faça login novamente'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      details: 'Sua sessão expirou, faça login novamente'
    });
  }

  // Erro interno do servidor
  res.status(500).json({
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Tente novamente mais tarde'
  });
};

// Wrapper para capturar erros em funções async
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
