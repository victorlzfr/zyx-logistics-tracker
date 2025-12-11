"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentController = void 0;
const connection_1 = require("../db/connection");
class ShipmentController {
    static async getAllShipments(req, res) {
        try {
            const result = await (0, connection_1.query)('SELECT * FROM shipments ORDER BY created_at DESC');
            const response = {
                success: true,
                count: result.rowCount,
                data: result.rows
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Error fetching shipments:', error);
            const response = {
                success: false,
                message: 'Erro ao buscar cargas',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            res.status(500).json(response);
        }
    }
    static async getShipmentById(req, res) {
        try {
            const { id } = req.params;
            const result = await (0, connection_1.query)('SELECT * FROM shipments WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                const response = {
                    success: false,
                    message: 'Carga não encontrada'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: result.rows[0]
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Error fetching shipment:', error);
            const response = {
                success: false,
                message: 'Erro ao buscar carga',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            res.status(500).json(response);
        }
    }
    static async getShipmentByTrackingNumber(req, res) {
        try {
            const { trackingNumber } = req.params;
            const result = await (0, connection_1.query)('SELECT * FROM shipments WHERE tracking_number = $1', [trackingNumber]);
            if (result.rows.length === 0) {
                const response = {
                    success: false,
                    message: 'Carga não encontrada'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: result.rows[0]
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Error fetching shipment by tracking:', error);
            const response = {
                success: false,
                message: 'Erro ao buscar carga',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            res.status(500).json(response);
        }
    }
    static async createShipment(req, res) {
        try {
            const requiredFields = [
                'customer_name',
                'origin',
                'destination'
            ];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    const response = {
                        success: false,
                        message: `Campo obrigatório faltando: ${field}`
                    };
                    res.status(400).json(response);
                    return;
                }
            }
            const trackingNumber = req.body.tracking_number || `ZYX${Date.now()}`;
            const shipmentData = {
                ...req.body,
                tracking_number: trackingNumber,
                quantity: req.body.quantity || 1,
                status: req.body.status || 'PENDING'
            };
            const queryText = `
        INSERT INTO shipments (
          tracking_number, customer_name, origin, destination, 
          product_description, quantity, weight_kg, status, 
          estimated_arrival, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
            const params = [
                shipmentData.tracking_number,
                shipmentData.customer_name,
                shipmentData.origin,
                shipmentData.destination,
                shipmentData.product_description || '',
                shipmentData.quantity,
                shipmentData.weight_kg || 0,
                shipmentData.status,
                shipmentData.estimated_arrival || null,
                shipmentData.notes || ''
            ];
            const result = await (0, connection_1.query)(queryText, params);
            const response = {
                success: true,
                message: 'Carga criada com sucesso',
                data: result.rows[0]
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Error creating shipment:', error);
            const response = {
                success: false,
                message: 'Erro ao criar carga',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            res.status(500).json(response);
        }
    }
    static async updateShipmentStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const validStatuses = [
                'PENDING',
                'IN_TRANSIT',
                'DELIVERED',
                'CANCELLED'
            ];
            if (!validStatuses.includes(status)) {
                const response = {
                    success: false,
                    message: `Status inválido. Use: ${validStatuses.join(', ')}`
                };
                res.status(400).json(response);
                return;
            }
            const queryText = `
        UPDATE shipments
        SET status = $1,
            updated_at = CURRENT_TIMESTAMP,
            actual_arrival = CASE
              WHEN $1 = 'DELIVERED' THEN CURRENT_DATE
              ELSE actual_arrival
            END
        WHERE id = $2
        RETURNING *
      `;
            const result = await (0, connection_1.query)(queryText, [status, id]);
            if (result.rows.length === 0) {
                const response = {
                    success: false,
                    message: 'Carga não encontrada'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                message: 'Status atualizado com sucesso',
                data: result.rows[0]
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Error updating shipment status:', error);
            const response = {
                success: false,
                message: 'Erro ao atualizar status',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            };
            res.status(500).json(response);
        }
    }
}
exports.ShipmentController = ShipmentController;
exports.default = ShipmentController;
//# sourceMappingURL=shipmentController.js.map