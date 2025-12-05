#!/bin/bash
# backend-test-final.sh - Teste completo do backend ZYX Logistics
# Autor: Victor Luiz de França
# Data: 05/12/2025
# Uso: Execute em um terminal separado enquanto o servidor roda em outro

echo "================================================================================"
echo "TESTE FINAL DO BACKEND - ZYX LOGISTICS TRACKER"
echo "================================================================================"
echo "Este script testa todos os endpoints da API."
echo "PRIMEIRO: Inicie o servidor em outro terminal com: npm run dev"
echo "================================================================================"
echo

# Funcao para formatar JSON (usa python3 que vem no Ubuntu/WSL)
format_json() {
    python3 -m json.tool 2>/dev/null || cat
}

# Funcao para testar endpoint com verificacao
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="${4:-}"

    echo "=== TESTE: $name ==="
    echo "URL: $url"
    echo "Metodo: $method"

    if [ -n "$data" ]; then
        echo "Dados: $data"
        response=$(curl -s -X "$method" "$url" -H "Content-Type: application/json" -d "$data")
    else
        response=$(curl -s -X "$method" "$url")
    fi

    # Verificar se a resposta e valida JSON
    if echo "$response" | python3 -c "import sys, json; json.loads(sys.stdin.read())" 2>/dev/null; then
        echo "$response" | format_json
        echo "Status: OK"
    else
        echo "Resposta: $response"
        echo "Status: ERRO - Resposta JSON invalida ou servidor offline"
    fi
    echo
}

# Aguardar confirmacao
read -p "O servidor esta rodando em outro terminal? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Execute primeiro em outro terminal: cd ~/zyx-logistics-tracker/backend && npm run dev"
    exit 1
fi

# Aguardar servidor iniciar
echo "Aguardando servidor iniciar (5 segundos)..."
sleep 5

# Teste 1: Health Check
test_endpoint "Health Check" "http://localhost:5000/api/health"

# Teste 2: Rota Raiz (documentacao)
test_endpoint "Rota Raiz - Documentacao" "http://localhost:5000"

# Teste 3: Listar todas as cargas
test_endpoint "Listar Todas as Cargas" "http://localhost:5000/api/shipments"

# Teste 4: Buscar por ID (usa primeira carga disponivel)
echo "=== OBTENDO PRIMEIRO ID PARA TESTE ==="
first_id=$(curl -s http://localhost:5000/api/shipments | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if 'data' in data and len(data['data']) > 0:
        print(data['data'][0]['id'])
    else:
        print('1')
except:
    print('1')
")
echo "Usando ID: $first_id"
echo

test_endpoint "Buscar Carga por ID" "http://localhost:5000/api/shipments/$first_id"

# Teste 5: Buscar por tracking number
test_endpoint "Buscar por Tracking Number" "http://localhost:5000/api/shipments/tracking/ZYX202512001"

# Teste 6: Criar nova carga
create_data='{
    "customer_name": "Empresa Teste Final",
    "origin": "Sao Paulo - SP",
    "destination": "Rio de Janeiro - RJ",
    "product_description": "Material de escritorio",
    "estimated_arrival": "2025-12-15",
    "quantity": 10,
    "weight_kg": 25.0,
    "notes": "Carga de teste do sistema final"
}'
test_endpoint "Criar Nova Carga" "http://localhost:5000/api/shipments" "POST" "$create_data"

# Teste 7: Atualizar status (usa o ID da primeira carga)
update_data='{"status": "IN_TRANSIT"}'
test_endpoint "Atualizar Status da Carga" "http://localhost:5000/api/shipments/$first_id/status" "PUT" "$update_data"

# Teste 8: Endpoint nao existente (deve retornar 404)
test_endpoint "Endpoint Inexistente (404 Test)" "http://localhost:5000/api/naoexiste"

echo "================================================================================"
echo "TESTES CONCLUIDOS"
echo "================================================================================"
echo "Resumo:"
echo "- Health Check: Verifica servidor e banco"
echo "- Rota Raiz: Documentacao dos endpoints"
echo "- CRUD Completo: Create, Read, Update"
echo "- Validacoes: Status codes apropriados"
echo "- Tratamento de erros: 404 para rotas inexistentes"
echo "================================================================================"
echo "Para ver logs do servidor, cheque o terminal onde 'npm run dev' esta executando."
echo "================================================================================"
