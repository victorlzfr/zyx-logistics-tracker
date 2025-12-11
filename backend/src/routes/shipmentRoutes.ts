import { Router } from 'express';
import ShipmentController from '../controllers/shipmentController';

const router: Router = Router();

// GET /api/shipments - Listar todas as cargas
router.get('/', ShipmentController.getAllShipments);

// GET /api/shipments/:id - Buscar carga por ID
router.get('/:id', ShipmentController.getShipmentById);

// GET /api/shipments/tracking/:trackingNumber - Buscar por tracking number
router.get('/tracking/:trackingNumber', ShipmentController.getShipmentByTrackingNumber);

// POST /api/shipments - Criar nova carga
router.post('/', ShipmentController.createShipment);

// PUT /api/shipments/:id/status - Atualizar status
router.put('/:id/status', ShipmentController.updateShipmentStatus);

// Nota: DELETE intencionalmente não implementado (decisão de negócio para preservar histórico)

export default router;
