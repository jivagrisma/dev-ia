const express = require('express');
const router = express.Router();

/**
 * Health Check Endpoint
 * GET /health
 * 
 * Criterios de aceptación:
 * - Responder HTTP 200
 * - Retornar JSON: {"status":"ok"}
 * - Endpoint accesible en /health
 */
router.get('/health', (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  };

  // Log del health check para monitoring
  console.log(`Health check requested at ${healthCheck.timestamp}`);

  res.status(200).json(healthCheck);
});

module.exports = router;
