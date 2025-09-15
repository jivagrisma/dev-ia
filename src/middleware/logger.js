const morgan = require('morgan');

/**
 * Logger Middleware Configuration
 * Configura logging HTTP para desarrollo y producción
 */

// Formato personalizado para logs
morgan.token('timestamp', () => {
  return new Date().toISOString();
});

// Formato de log personalizado
const logFormat = ':timestamp :method :url :status :res[content-length] - :response-time ms';

// Configuración según el entorno
const logger = process.env.NODE_ENV === 'production' 
  ? morgan('combined')  // Formato estándar para producción
  : morgan(logFormat);  // Formato personalizado para desarrollo

module.exports = logger;
