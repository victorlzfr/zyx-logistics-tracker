# Automação com n8n

## Integração com o ZYX Logistics

### Fluxo Implementado: Health Check Monitor
**Objetivo**: Monitorar automaticamente a saúde da API ZYX.

**Configuração**:
1. **Nó HTTP Request** configurado para `GET http://backend:5000/api/health`
2. **Execução**: Manual (para testes) ou agendada

**Resposta Esperada**:
```json
{
  "success": true,
  "message": "ZYX Logistics API is running",
  "data": { ... }
}
```

## Casos de Uso Futuros
1. **Criação Automática de Shipments**: Receber dados de planilha/forms e criar via API

2. **Notificação de Status**: Alertar quando shipment mudar para "DELIVERED"

3. **Sincronização de Dados**: Entre sistemas internos e a plataforma ZYX

## Configuração do n8n no Projeto
- Serviço Docker na rede zyx_network

- Acesso via http://localhost:5678

- Volume persistente para workflows
