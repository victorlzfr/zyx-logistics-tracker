# Schemas do Banco de Dados

## Arquivo Principal
- `schema-zyx-logistics.sql` - Schema completo do banco

## Tabelas
### shipments
Tabela principal de cargas/envios da ZYX Logística.

### shipment_tracking
Histórico de rastreamento das cargas.

## Views
### vw_shipment_dashboard
View consolidada para dashboard e relatórios.

## Como Usar
```bash
# Para recriar o banco do zero
psql -U postgres -d logistics -f schema-zyx-logistics.sql

# O schema é executado automaticamente pelo Docker Compose
