import { Request, Response } from 'express';
import { query } from '../db/connection';
import { 
  Shipment, 
  ShipmentCreateDTO, 
  ShipmentUpdateDTO, 
  ApiResponse,
  ShipmentStatus 
} from '../types/shipment.types';

export class ShipmentController {
  // GET /api/shipments - Listar todas as cargas
  static async getAllShipments(
    req: Request, 
    res: Response<ApiResponse<Shipment[]>>
  ): Promise<void> {
    try {
      const result = await query<Shipment>(
        'SELECT * FROM shipments ORDER BY created_at DESC'
      );
      
      const response: ApiResponse<Shipment[]> = {
        success: true,
        count: result.rowCount,
        data: result.rows
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      console.error('Error fetching shipments:', error);
      
      const response: ApiResponse = {
        success: false,
        message: 'Erro ao buscar cargas',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
      
      res.status(500).json(response);
    }
  }

  // GET /api/shipments/:id - Buscar carga por ID
  static async getShipmentById(
    req: Request<{ id: string }>, 
    res: Response<ApiResponse<Shipment>>
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await query<Shipment>(
        'SELECT * FROM shipments WHERE id = $1', 
        [id]
      );

      if (result.rows.length === 0) {
        const response: ApiResponse = {
          success: false,
          message: 'Carga não encontrada'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Shipment> = {
        success: true,
        data: result.rows[0]
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      console.error('Error fetching shipment:', error);
      
      const response: ApiResponse = {
        success: false,
        message: 'Erro ao buscar carga',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
      
      res.status(500).json(response);
    }
  }

  // GET /api/shipments/tracking/:trackingNumber - Buscar por número de rastreamento
  static async getShipmentByTrackingNumber(
    req: Request<{ trackingNumber: string }>, 
    res: Response<ApiResponse<Shipment>>
  ): Promise<void> {
    try {
      const { trackingNumber } = req.params;
      const result = await query<Shipment>(
        'SELECT * FROM shipments WHERE tracking_number = $1', 
        [trackingNumber]
      );

      if (result.rows.length === 0) {
        const response: ApiResponse = {
          success: false,
          message: 'Carga não encontrada'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Shipment> = {
        success: true,
        data: result.rows[0]
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      console.error('Error fetching shipment by tracking:', error);
      
      const response: ApiResponse = {
        success: false,
        message: 'Erro ao buscar carga',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
      
      res.status(500).json(response);
    }
  }

  // POST /api/shipments - Criar nova carga
  static async createShipment(
    req: Request<{}, {}, ShipmentCreateDTO>, 
    res: Response<ApiResponse<Shipment>>
  ): Promise<void> {
    try {
      // Validação dos campos obrigatórios
      const requiredFields: (keyof ShipmentCreateDTO)[] = [
        'customer_name', 
        'origin', 
        'destination'
      ];
      
      for (const field of requiredFields) {
        if (!req.body[field]) {
          const response: ApiResponse = {
            success: false,
            message: `Campo obrigatório faltando: ${field}`
          };
          res.status(400).json(response);
          return;
        }
      }

      // Gerar número de rastreamento automático se não fornecido
      const trackingNumber = req.body.tracking_number || `ZYX${Date.now()}`;
      
      const shipmentData: ShipmentCreateDTO = {
        ...req.body,
        tracking_number: trackingNumber,
        quantity: req.body.quantity || 1,
        status: req.body.status || 'PENDING' as ShipmentStatus
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

      const result = await query<Shipment>(queryText, params);

      const response: ApiResponse<Shipment> = {
        success: true,
        message: 'Carga criada com sucesso',
        data: result.rows[0]
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      console.error('Error creating shipment:', error);
      
      const response: ApiResponse = {
        success: false,
        message: 'Erro ao criar carga',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
      
      res.status(500).json(response);
    }
  }

  // PUT /api/shipments/:id/status - Atualizar status da carga
  static async updateShipmentStatus(
    req: Request<{ id: string }, {}, ShipmentUpdateDTO>, 
    res: Response<ApiResponse<Shipment>>
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses: ShipmentStatus[] = [
        'PENDING', 
        'IN_TRANSIT', 
        'DELIVERED', 
        'CANCELLED'
      ];
      
      if (!validStatuses.includes(status)) {
        const response: ApiResponse = {
          success: false,
          message: `Status inválido. Use: ${validStatuses.join(', ')}`
        };
        res.status(400).json(response);
        return;
      }

      const queryText = `
        UPDATE shipments
        SET status = $1::character varying(20),
            updated_at = CURRENT_TIMESTAMP,
            actual_arrival = CASE
              WHEN $1 = 'DELIVERED' THEN CURRENT_DATE
              ELSE actual_arrival
            END
        WHERE id = $2
        RETURNING *
      `;

      const result = await query<Shipment>(queryText, [status, id]);

      if (result.rows.length === 0) {
        const response: ApiResponse = {
          success: false,
          message: 'Carga não encontrada'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Shipment> = {
        success: true,
        message: 'Status atualizado com sucesso',
        data: result.rows[0]
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      console.error('Error updating shipment status:', error);
      
      const response: ApiResponse = {
        success: false,
        message: 'Erro ao atualizar status',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
      
      res.status(500).json(response);
    }
  }
}

export default ShipmentController;
