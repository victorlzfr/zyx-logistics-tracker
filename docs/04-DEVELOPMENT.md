# Guia de Desenvolvimento

## Primeiros Passos

### Pré-requisitos
- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local)

## Métodos de Execução

### 1. Docker Compose (Recomendado)
```bash
docker-compose up -d
```

## Serviços disponíveis:

**Frontend**: http://localhost:5173

**Backend API**: http://localhost:5000

**n8n**: http://localhost:5678

**PostgreSQL**: localhost:5434

## Desenvolvimento Local
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend  
cd frontend && npm install && npm run dev
```

## Variáveis de Ambiente
**.env na raiz**: Configurações gerais

**backend/.env**: Configurações do backend
