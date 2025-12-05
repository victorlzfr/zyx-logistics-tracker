// shipmentController.js - Controlador para cargas
// Recebe requisições HTTP e chama os métodos do Model
// Autor: Victor Luiz de França

const Shipment = require('../models/Shipment');

class ShipmentController {
  // GET /api/shipments - Listar todas as cargas
  static async getAllShipments(req, res) {
    try {
      const shipments = await Shipment.findAll();
      res.status(200).json({
        success: true,
        count: shipments.length,
        data: shipments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar cargas',
        error: error.message
      });
    }
  }

  // GET /api/shipments/:id - Buscar carga por ID
  static async getShipmentById(req, res) {
    try {
      const shipment = await Shipment.findById(req.params.id);

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Carga não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: shipment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar carga',
        error: error.message
      });
    }
  }

  // GET /api/shipments/tracking/:trackingNumber - Buscar por número de rastreamento
  static async getShipmentByTrackingNumber(req, res) {
    try {
      const shipment = await Shipment.findByTrackingNumber(req.params.trackingNumber);

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Carga não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: shipment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar carga',
        error: error.message
      });
    }
  }

  // POST /api/shipments - Criar nova carga
  static async createShipment(req, res) {
    try {
      // Validação básica dos dados recebidos
      const requiredFields = ['customer_name', 'origin', 'destination', 'product_description', 'estimated_arrival'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            success: false,
            message: `Campo obrigatório faltando: ${field}`
          });
        }
      }

      // Gerar número de rastreamento automático se não fornecido
      const shipmentData = {
        ...req.body,
        tracking_number: req.body.tracking_number || `ZYX${Date.now()}`
      };

      const newShipment = await Shipment.create(shipmentData);

      res.status(201).json({
        success: true,
        message: 'Carga criada com sucesso',
        data: newShipment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar carga',
        error: error.message
      });
    }
  }

  // PUT /api/shipments/:id/status - Atualizar status da carga
  static async updateShipmentStatus(req, res) {
    try {
      // Método simples - apenas atualiza o status no banco
      const validStatuses = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: `Status inválido. Use: ${validStatuses.join(', ')}`
        });
      }

      // Query SQL direta para atualizar
      const query = `
        UPDATE shipments
        SET status = $1::VARCHAR,
            updated_at = CURRENT_TIMESTAMP,
            actual_arrival = CASE
              WHEN $1::VARCHAR = 'DELIVERED' THEN CURRENT_DATE
              ELSE actual_arrival
            END
        WHERE id = $2
        RETURNING *
      `;

      const db = require('../db/connection');
      const result = await db.query(query, [req.body.status, req.params.id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Carga não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Status atualizado com sucesso',
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar status',
        error: error.message
      });
    }
  }
}

module.exports = ShipmentController;
