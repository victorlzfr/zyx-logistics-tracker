// Shipment.js - Modelo para cargas
// Este arquivo "conversa" com a tabela shipments no PostgreSQL
// Autor: Victor Luiz de França

const db = require('../db/connection');

class Shipment {
  // Método 1: Buscar TODAS as cargas
  static async findAll() {
    try {
      // SQL: SELECT * FROM shipments (busca tudo da tabela shipments)
      const query = "SELECT * FROM shipments ORDER BY created_at DESC";
      const result = await db.query(query);

      // result.rows contém os dados do banco
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar cargas:", error.message);
      throw error;
    }
  }

  // Método 2: Buscar UMA carga por ID
  static async findById(id) {
    try {
      // SQL: SELECT * FROM shipments WHERE id = ?
      const query = "SELECT * FROM shipments WHERE id = $1";
      const result = await db.query(query, [id]);

      // Se encontrar, retorna a primeira linha (índice 0)
      // Se não encontrar, retorna undefined
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao buscar carga por ID:", error.message);
      throw error;
    }
  }

  // Método 3: Buscar por número de rastreamento
  static async findByTrackingNumber(trackingNumber) {
    try {
      // SQL: SELECT * FROM shipments WHERE tracking_number = ?
      const query = "SELECT * FROM shipments WHERE tracking_number = $1";
      const result = await db.query(query, [trackingNumber]);

      return result.rows[0];
    } catch (error) {
      console.error("Erro ao buscar por tracking number:", error.message);
      throw error;
    }
  }

  // Método 4: Criar NOVA carga
  static async create(shipmentData) {
    try {
      // SQL: INSERT INTO shipments (...) VALUES (...)
      const query = `
        INSERT INTO shipments (
          tracking_number,
          customer_name,
          origin,
          destination,
          product_description,
          quantity,
          weight_kg,
          status,
          estimated_arrival,
          notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      // Parâmetros para o SQL ($1, $2, etc.)
      const params = [
        shipmentData.tracking_number,
        shipmentData.customer_name,
        shipmentData.origin,
        shipmentData.destination,
        shipmentData.product_description,
        shipmentData.quantity ?? 1,  // CORREÇÃO: ?? em vez de ||
        shipmentData.weight_kg,
        shipmentData.status || 'PENDING',
        shipmentData.estimated_arrival,
        shipmentData.notes || ''
      ];

      const result = await db.query(query, params);
      return result.rows[0]; // Retorna a carga criada
    } catch (error) {
      console.error("Erro ao criar carga:", error.message);
      throw error;
    }
  }
}

// Exportar a classe para usar em outros arquivos
module.exports = Shipment;
