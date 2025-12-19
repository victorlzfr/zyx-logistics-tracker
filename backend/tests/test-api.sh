#!/bin/bash
# test-api.sh - Testes simples para a API ZYX Logistics
# Autor: Victor Luiz de França

echo "=== TESTES DA API ZYX LOGISTICS ==="
echo "Servidor rodando em: http://localhost:5000"
echo

# Teste 1: Health check
echo "1. Testando health check..."
curl -s http://localhost:5000/api/health | python3 -m json.tool | grep '"status"' || echo "Health check falhou"

# Teste 2: Listar todas as cargas
echo -e "\n2. Listando todas as cargas..."
curl -s http://localhost:5000/api/shipments | python3 -m json.tool | grep '"count"' || echo "Listar cargas falhou"

# Teste 3: Buscar carga por ID (primeira carga)
echo -e "\n3. Buscando primeira carga por ID..."
first_id=$(curl -s http://localhost:5000/api/shipments | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data'][0]['id'] if 'data' in data and len(data['data'])>0 else '1')")
curl -s http://localhost:5000/api/shipments/$first_id | python3 -m json.tool | grep '"tracking_number"' || echo "Buscar por ID falhou"

# Teste 4: Buscar por tracking number
echo -e "\n4. Buscando por número de rastreamento..."
curl -s "http://localhost:5000/api/shipments/tracking/ZYX202512001" | python3 -m json.tool | grep '"customer_name"' || echo "Buscar por tracking falhou"

# Teste 5: Criar nova carga
echo -e "\n5. Criando nova carga..."
curl -s -X POST http://localhost:5000/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Cliente Teste API",
    "origin": "São Paulo - SP",
    "destination": "Campinas - SP",
    "product_description": "Produtos de teste",
    "estimated_arrival": "2025-12-20",
    "quantity": 5,
    "weight_kg": 10.5
  }' | python3 -m json.tool | grep '"success"' || echo "Criar carga falhou"

echo -e "\nTestes completos!"
echo "Use 'curl http://localhost:5000' para ver todos os endpoints disponíveis"
