import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: '/api', // Usa o proxy configurado no vite.config.js
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging (útil para debug)
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
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

// API específica para shipments
export const shipmentAPI = {
  // GET: Listar todos os shipments
  getAll: () => api.get('/shipments'),

  // GET: Buscar shipment por ID
  getById: (id) => api.get(`/shipments/${id}`),

  // GET: Buscar shipment por tracking number
  getByTrackingNumber: (trackingNumber) =>
    api.get(`/shipments/tracking/${trackingNumber}`),

  // POST: Criar novo shipment
  create: (shipmentData) => api.post('/shipments', shipmentData),

  // PUT: Atualizar status do shipment
  updateStatus: (id, status) =>
    api.put(`/shipments/${id}/status`, { status }),
};

export default api;
