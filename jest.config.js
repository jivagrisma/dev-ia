/**
 * Jest Configuration
 * Configuración para testing con Jest
 */

module.exports = {
  // Entorno de testing
  testEnvironment: 'node',
  
  // Cobertura de código
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  
  // Patrones de archivos de test
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Archivos a incluir en cobertura
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',  // Excluir server.js de cobertura
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  
  // Umbrales de cobertura
  coverageThreshold: {
    global: {
      branches: 40,  // Reducido para branches condicionales
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup y teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Timeout para tests
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Detectar archivos abiertos
  detectOpenHandles: true,
  
  // Forzar salida después de tests
  forceExit: true
};
