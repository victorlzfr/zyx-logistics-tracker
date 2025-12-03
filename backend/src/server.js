const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de saúde (health check)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Servidor ZYX Logistics está funcionando',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL via Docker',
    port: process.env.DB_PORT,
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API ZYX Logistics Tracker',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      docs: 'Em desenvolvimento',
    },
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`anco de dados: PostgreSQL na porta ${process.env.DB_PORT}`);
});
