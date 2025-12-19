// frontend/src/types/shipment.types.ts
export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface Shipment {
  id: number;
  tracking_number: string;
  customer_name: string;
  origin: string;
  destination: string;
  product_description?: string;
  quantity: number;
  weight_kg?: number;
  status: ShipmentStatus;
  estimated_arrival?: string;
  actual_arrival?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentCreateDTO {
  customer_name: string;
  origin: string;
  destination: string;
  product_description?: string;
  quantity?: number;
  weight_kg?: number;
  status?: ShipmentStatus;
  estimated_arrival?: string;
  notes?: string;
  tracking_number?: string;
}

export interface ShipmentUpdateDTO {
  status: ShipmentStatus;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
}
