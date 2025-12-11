// server.js - ZYX Logistics Tracker API
// Autor: Victor Luiz de França
// Data: 03/12/2025
// Para: DHL Teste Técnico - Analista de Sistemas Operacionais JR

// 1. IMPORTAÇÕES ========================================================
const express = require('express');       // Framework web para Node.js
const cors = require('cors');             // Middleware para Cross-Origin Resource Sharing
const morgan = require('morgan');         // Middleware para logging de requisições HTTP
require('dotenv').config();               // Carrega variáveis do arquivo .env

// Importar conexão com banco de dados PostgreSQL
const db = require('./db/connection');

// 2. CONFIGURAÇÃO INICIAL ===============================================
const app = express();                    // Cria instância do Express
const PORT = process.env.PORT || 5000;    // Porta do servidor (5000 em desenvolvimento)

// 3. MIDDLEWARES ========================================================
// Middlewares são funções que processam requisições antes de chegarem às rotas

// CORS: Permite que frontend em domínio diferente acesse a API
app.use(cors());

// Morgan: Logging de requisições HTTP (apenas desenvolvimento)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));  // Formato conciso: GET /api/health 200 15.123 ms
}

// Express.json(): Converte corpo das requisições JSON em objeto JavaScript
app.use(express.json());

// Express.urlencoded(): Processa dados de formulários HTML
app.use(express.urlencoded({ extended: true }));

// 4. ROTAS DA API =======================================================
// Rotas definem endpoints (URLs) que a API responde

// Rota de saúde (health check) - Verifica se servidor e banco estão funcionando
app.get('/api/health', async (req, res) => {
  // 'async' permite uso de 'await' para operações assíncronas (como banco de dados)
  try {
    // Conecta ao banco e executa query para testar conexão
    const client = await db.pool.connect();
    const dbResult = await client.query('SELECT NOW() as current_time, version() as pg_version');
    client.release(); // Libera conexão para o pool

    // Resposta de sucesso
    res.status(200).json({
      status: 'healthy',
      message: 'Servidor ZYX Logistics está funcionando',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        postgres_version: dbResult.rows[0].pg_version.split(' ')[1],
        server_time: dbResult.rows[0].current_time,
        port: process.env.DB_PORT
      },
      environment: process.env.NODE_ENV,
      version: '1.0.0'
    });
  } catch (error) {
    // Resposta de erro (banco indisponível)
    res.status(503).json({
      status: 'degraded',
      message: 'Servidor online, mas banco de dados indisponível',
      error: error.message,
      database: {
        connected: false,
        port: process.env.DB_PORT
      },
      environment: process.env.NODE_ENV
    });
  }
});

// Rota raiz - Informações básicas da API
app.get('/', (req, res) => {
  res.json({
    message: 'API ZYX Logistics Tracker - DHL Teste Técnico',
    version: '1.0.0',
    author: 'Victor Luiz de França',
    endpoints: {
      health: 'GET /api/health',
      shipments: {
        getAll: 'GET /api/shipments',
        getById: 'GET /api/shipments/:id',
        getByTracking: 'GET /api/shipments/tracking/:trackingNumber',
        create: 'POST /api/shipments',
        updateStatus: 'PUT /api/shipments/:id/status'
      }
    },
    repository: 'github.com/victorlzfr/zyx-logistics-tracker'
  });
});

// Importar e usar as rotas de shipments
const shipmentRoutes = require('./routes/shipmentRoutes');
app.use('/api/shipments', shipmentRoutes);
// 5. MIDDLEWARE PARA ROTAS NÃO ENCONTRADAS (404) ========================
// Captura qualquer rota que não foi definida acima
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.originalUrl,
    available_endpoints: ['GET /', 'GET /api/health']
  });
});


// 6. MIDDLEWARE DE ERRO GLOBAL ==========================================
// IMPORTANTE: Este middleware DEVE SER o último da cadeia
// Captura qualquer erro não tratado nas rotas acima
app.use((error, req, res, next) => {
  // Log do erro no console para debug (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.error('Erro no servidor:', error.stack);
  }

  // Resposta ao cliente
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Entre em contato com o administrador'
  });
});

// 7. INICIALIZAÇÃO DO SERVIDOR ==========================================
app.listen(PORT, () => {
  console.log(`Servidor ZYX Logistics iniciado`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Banco: PostgreSQL na porta ${process.env.DB_PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
  console.log(`Hora: ${new Date().toLocaleTimeString('pt-BR')}`);

  // Teste de conexão com banco ao iniciar servidor
  console.log('\nTestando conexão com banco de dados...');
  db.pool.query('SELECT NOW() as server_time')
    .then(result => {
      console.log(`Banco conectado! Hora do servidor: ${result.rows[0].server_time}`);
    })
    .catch(error => {
      console.log(`Atencao: Nao foi possivel conectar ao banco: ${error.message}`);
      console.log('Verifique:');
      console.log('1. Container PostgreSQL esta rodando? (docker ps)');
      console.log('2. Credenciais no .env estao corretas?');
      console.log('3. Porta 5433 esta liberada?');
    });
});

// 8. EXPORTAÇÃO =========================================================
// Exporta a app para testes (opcional, para futuros testes unitários)
module.exports = app;
