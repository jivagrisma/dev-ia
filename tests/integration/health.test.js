const request = require('supertest');
const app = require('../../src/app');

/**
 * Health Endpoint Integration Tests
 * 
 * Criterios de aceptación:
 * - Test de respuesta 200
 * - Test de contenido JSON correcto
 * - Test de performance (< 100ms)
 * - Test de estructura de respuesta
 */

describe('GET /health', () => {
  
  test('should return 200 status code', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });

  test('should return correct JSON structure', async () => {
    const response = await request(app).get('/health');
    
    // Verificar criterio de aceptación principal
    expect(response.body).toHaveProperty('status', 'ok');
    
    // Verificar estructura completa
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('environment');
    expect(response.body).toHaveProperty('version');
  });

  test('should return valid timestamp format', async () => {
    const response = await request(app).get('/health');
    
    const timestamp = response.body.timestamp;
    expect(timestamp).toBeDefined();
    
    // Verificar que es un timestamp ISO válido
    const date = new Date(timestamp);
    expect(date.toISOString()).toBe(timestamp);
  });

  test('should return numeric uptime', async () => {
    const response = await request(app).get('/health');
    
    expect(typeof response.body.uptime).toBe('number');
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
  });

  test('should respond within 100ms', async () => {
    const start = Date.now();
    await request(app).get('/health');
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(100);
  });

  test('should return correct content-type', async () => {
    const response = await request(app).get('/health');
    
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  test('should handle multiple concurrent requests', async () => {
    const requests = Array(10).fill().map(() => request(app).get('/health'));
    const responses = await Promise.all(requests);
    
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

});

describe('API Root Endpoint', () => {
  
  test('should return API information at root', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'AI Methodology API');
    expect(response.body).toHaveProperty('endpoints');
    expect(response.body.endpoints).toHaveProperty('health', '/health');
  });

});

describe('404 Error Handling', () => {
  
  test('should return 404 for non-existent endpoints', async () => {
    const response = await request(app).get('/non-existent');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Endpoint not found');
  });

});
