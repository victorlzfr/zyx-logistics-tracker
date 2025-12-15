// frontend/src/services/api.ts
import axios from 'axios';
import type { 
  AxiosInstance, 
  InternalAxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';
import type { 
  Shipment, 
  ShipmentCreateDTO, 
  ShipmentUpdateDTO, 
  ApiResponse 
} from '../types/shipment.types';

// Configuração base do Axios com tipagem
const api: AxiosInstance = axios.create({
  baseURL: '/api', // Usa o proxy configurado no vite.config.js
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging (útil para debug)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('[API] Erro do servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('[API] Sem resposta do servidor:', error.request);
    } else {
      console.error('[API] Erro ao configurar requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

// API específica para shipments com tipagem completa
export const shipmentAPI = {
  // GET: Listar todos os shipments
  getAll: (): Promise<AxiosResponse<ApiResponse<Shipment[]>>> => 
    api.get('/shipments'),

  // GET: Buscar shipment por ID
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Shipment>>> => 
    api.get(`/shipments/${id}`),

  // GET: Buscar shipment por tracking number
  getByTrackingNumber: (trackingNumber: string): Promise<AxiosResponse<ApiResponse<Shipment>>> =>
    api.get(`/shipments/tracking/${trackingNumber}`),

  // POST: Criar novo shipment
  create: (shipmentData: ShipmentCreateDTO): Promise<AxiosResponse<ApiResponse<Shipment>>> => 
    api.post('/shipments', shipmentData),

  // PUT: Atualizar status do shipment
  updateStatus: (id: number, status: ShipmentUpdateDTO['status']): Promise<AxiosResponse<ApiResponse<Shipment>>> =>
    api.put(`/shipments/${id}/status`, { status }),
};

export default api;
