#!/bin/bash
# test-estrutura.sh - Testes estruturais para CI/CD
# Não requer servidor rodando - verifica apenas estrutura

set -e  # Sai se encontrar erro

echo "=== TESTES ESTRUTURAIS PARA CI/CD ==="
echo "Projeto: ZYX Logistics Tracker"
echo "Data: $(date)"
echo

# Teste 1: Verificar arquivos TypeScript
echo "1. Verificando arquivos TypeScript..."
ARQUIVOS_TS=("server.ts" "controllers/shipmentController.ts" "routes/shipmentRoutes.ts" "db/connection.ts")
for arquivo in "${ARQUIVOS_TS[@]}"; do
    if [ -f "src/$arquivo" ]; then
        echo "  ✅ src/$arquivo existe"
    else
        echo "  ❌ src/$arquivo faltando"
        exit 1
    fi
done

# Teste 2: Verificar schema SQL
echo -e "\n2. Verificando schema do banco de dados..."
if [ -f "src/models/schemas/schema-zyx-logistics.sql" ]; then
    echo "  ✅ Arquivo de schema existe"
    linhas=$(wc -l < src/models/schemas/schema-zyx-logistics.sql)
    echo "    Linhas: $linhas"
    if [ $linhas -gt 100 ]; then
        echo "    ✅ Schema parece completo"
    else
        echo "    ⚠ Schema pode estar incompleto"
    fi
else
    echo "  ❌ Arquivo de schema faltando"
    exit 1
fi

# Teste 3: Verificar package.json
echo -e "\n3. Verificando package.json..."
if [ -f "package.json" ]; then
    echo "  ✅ package.json existe"
    
    # Verificar scripts essenciais
    SCRIPTS_ESSENCIAIS=("build" "type-check" "start" "dev")
    for script in "${SCRIPTS_ESSENCIAIS[@]}"; do
        if grep -q "\"$script\"" package.json; then
            echo "    ✅ Script '$script' encontrado"
        else
            echo "    ⚠ Script '$script' não encontrado"
        fi
    done
else
    echo "  ❌ package.json faltando"
    exit 1
fi

# Teste 4: Verificar tsconfig.json
echo -e "\n4. Verificando tsconfig.json..."
if [ -f "tsconfig.json" ]; then
    echo "  ✅ tsconfig.json existe"
    if grep -q "\"strict\": true" tsconfig.json; then
        echo "    ✅ TypeScript strict mode ativado"
    fi
else
    echo "  ❌ tsconfig.json faltando"
    exit 1
fi

echo -e "\n=== TODOS OS TESTES ESTRUTURAIS PASSARAM ==="
echo "✅ Estrutura do projeto válida para pipeline CI/CD"
echo "✅ Pronto para integração contínua"
