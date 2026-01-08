# Banco de Dados

## Schema Principal

### Tabela: shipments
Registro principal de cargas/envios.

### Tabela: shipment_tracking
Histórico de rastreamento das cargas.

### View: vw_shipment_dashboard
View consolidada para dashboard e relatórios.

## Exemplo de Query
```sql
-- Buscar shipments pendentes
SELECT * FROM shipments 
WHERE status = 'PENDING'
ORDER BY created_at DESC;
```
## Relacionamentos
shipment_tracking.shipment_id → shipments.id
