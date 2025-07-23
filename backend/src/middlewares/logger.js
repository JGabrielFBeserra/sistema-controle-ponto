import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

// Criar diretório de logs se não existir
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Logger simples
class Logger {
  static log(level, message, data = null) {
    const timestamp = new Date().toLocaleString('pt-BR');
    
    // Console com cores
    const colors = {
      info: '\x1b[36m',    // Ciano
      error: '\x1b[31m',   // Vermelho  
      warn: '\x1b[33m',    // Amarelo
      reset: '\x1b[0m'     // Reset
    };
    
    // Console
    console.log(`${colors[level] || colors.info}[${timestamp}] ${level.toUpperCase()}: ${message}${colors.reset}`);
    if (data) console.log(data);

    // Arquivo
    try {
      const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
      const logLine = `[${timestamp}] ${level.toUpperCase()}: ${message} ${data ? JSON.stringify(data) : ''}\n`;
      
      fs.appendFileSync(logFile, logLine);
    } catch (error) {
      console.error('Erro ao escrever no arquivo de log:', error.message);
    }
  }

  static info(message, data = null) {
    this.log('info', message, data);
  }

  static error(message, data = null) {
    this.log('error', message, data);
  }

  static warn(message, data = null) {
    this.log('warn', message, data);
  }
}

// Middleware para logar requisições
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toLocaleString('pt-BR');
  
  // Log da requisição recebida
  Logger.info(`${req.method} ${req.originalUrl} - Iniciado`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? 'ERRO' : 'SUCESSO';
    Logger.info(`${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms - ${statusColor}`);
  });

  next();
};

export default Logger;
