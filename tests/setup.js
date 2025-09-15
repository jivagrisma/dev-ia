/**
 * Jest Setup Configuration
 * Configuración global para todos los tests
 */

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Puerto aleatorio para tests

// Configurar timeouts
jest.setTimeout(10000);

// Suprimir logs durante testing (opcional)
if (process.env.SUPPRESS_LOGS === 'true') {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
}

// Setup global antes de todos los tests
beforeAll(() => {
  // Configuración global si es necesaria
});

// Cleanup después de todos los tests
afterAll(() => {
  // Cleanup global si es necesario
});

// Setup antes de cada test
beforeEach(() => {
  // Reset de mocks si es necesario
  jest.clearAllMocks();
});

// Cleanup después de cada test
afterEach(() => {
  // Cleanup específico por test si es necesario
});
