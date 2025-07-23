import 'dotenv/config.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import deptRoutes from './routes/departamentos.js';
import funcRoutes from './routes/funcionarios.js';
import relRoutes from './routes/relatorios.js';
import usuarioRoutes from './routes/usuarios.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/logger.js';
import Logger from './middlewares/logger.js';

const app = express();

// CORS Configuration - deve vir ANTES de outras configurações
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'], // Frontend URL
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(cookieParser());

// Middleware de log de requisições (deve ser antes das rotas)
app.use(requestLogger);

// Rota de teste de logs
app.get('/test-logs', (req, res) => {
  Logger.info('🧪 Teste de logs executado');
  Logger.warn('⚠️ Este é um teste de warning');
  Logger.error('❌ Este é um teste de erro');
  res.json({ 
    message: 'Teste de logs executado com sucesso!',
    timestamp: new Date().toISOString(),
    logs: 'Verifique o console e o arquivo logs/'
  });
});

// Rotas
app.use('/auth', authRoutes);
app.use('/departamentos', deptRoutes);
app.use('/funcionarios', funcRoutes);
app.use('/relatorios', relRoutes);
app.use('/usuarios', usuarioRoutes);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ouvindo na porta: ${PORT}`);
  Logger.info(`🚀 Servidor iniciado na porta ${PORT}`);
  Logger.info('📝 Sistema de logs ativo - Console + Arquivo');
});
