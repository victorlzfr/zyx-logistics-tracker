# Documentação da API

## Endpoints Principais

### Health Check
- **GET** `/api/health`
- **Resposta**: Status da API e informações do serviço.

### Gerenciamento de Shipments
- **GET** `/api/shipments` - Lista todos os shipments
- **GET** `/api/shipments/:id` - Busca shipment por ID
- **GET** `/api/shipments/tracking/:trackingNumber` - Busca por número de rastreamento
- **POST** `/api/shipments` - Cria novo shipment
- **PUT** `/api/shipments/:id/status` - Atualiza status do shipment

## Exemplo de Request/Response
**POST /api/shipments**
```json
{
  "customer_name": "Cliente Exemplo",
  "origin": "São Paulo",
  "destination": "Rio de Janeiro",
  "quantity": 5
}
```

## Status Codes
200: Sucesso
201: Criado
400: Bad Request
404: Não encontrado
500: Erro interno
