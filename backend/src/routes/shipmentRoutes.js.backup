// shipmentRoutes.js - Rotas para API de cargas
// Define os endpoints (URLs) que a API responde
// Autor: Victor Luiz de França

const express = require('express');
const router = express.Router();
const ShipmentController = require('../controllers/shipmentController');

// ROTA 1: Listar todas as cargas
// GET http://localhost:5000/api/shipments
router.get('/', ShipmentController.getAllShipments);

// ROTA 2: Buscar carga específica por ID
// GET http://localhost:5000/api/shipments/1
router.get('/:id', ShipmentController.getShipmentById);

// ROTA 3: Buscar por número de rastreamento
// GET http://localhost:5000/api/shipments/tracking/ZYX202512001
router.get('/tracking/:trackingNumber', ShipmentController.getShipmentByTrackingNumber);

// ROTA 4: Criar nova carga
// POST http://localhost:5000/api/shipments
router.post('/', ShipmentController.createShipment);

// ROTA 5: Atualizar status da carga
// PUT http://localhost:5000/api/shipments/1/status
router.put('/:id/status', ShipmentController.updateShipmentStatus);

// Exportar o router para usar no server.js
module.exports = router;
