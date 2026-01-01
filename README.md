# ZYX Logistics Tracker

[![CI/CD Status](https://github.com/victorlzfr/zyx-logistics-tracker/actions/workflows/lint-build.yml/badge.svg)](https://github.com/victorlzfr/zyx-logistics-tracker/actions)
[![Docker Build](https://github.com/victorlzfr/zyx-logistics-tracker/actions/workflows/docker-build.yml/badge.svg)](https://github.com/victorlzfr/zyx-logistics-tracker/actions)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-19.x-cyan)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)

Sistema completo de rastreamento logístico desenvolvido para digitalizar processos da ZYX Logística. Projeto completo com CI/CD, Docker e TypeScript.

## Comece Rápido

```bash
# 1. Clone o repositório
git clone https://github.com/victorlzfr/zyx-logistics-tracker.git
cd zyx-logistics-tracker

# 2. Inicie com Docker (recomendado)
docker-compose up -d

# 3. Acesse:
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
```

## Arquitetura
- Backend: Node.js 20 + Express + TypeScript + PostgreSQL

- Frontend: React 19 + Vite + TypeScript + Tailwind CSS

- Infra: Docker + Docker Compose + GitHub Actions CI/CD

- Banco: PostgreSQL com schema otimizado para logística

## Estrutura do Projeto
```bash
zyx-logistics-tracker/
├── .github/workflows/    # CI/CD pipelines
├── backend/              # API TypeScript
├── frontend/             # React TypeScript
├── development-sessions/ # Histórico completo (30+ sessões)
├── docs/                 # Documentação técnica
└── docker-compose.yml    # Orquestração
```
## Funcionalidades Principais
- CRUD Completo de shipments (exceto delete por decisão de negócio)

- Dashboard em tempo real com status consolidado

- Validação multi-camada (frontend, backend, banco)

- Interface responsiva com Tailwind CSS

- Containerização completa com Docker

- CI/CD profissional com GitHub Actions

- TypeScript em todo o stack para segurança de tipos

## Documentação Detalhada
- [Arquitetura do Sistema](docs/01-ARCHITECTURE.md)
- [API Endpoints](docs/02-API.md)
- [Banco de Dados](docs/03-DATABASE.md)
- [Desenvolvimento](docs/04-DEVELOPMENT.md)
- [Deploy e CI/CD](docs/05-DEPLOYMENT.md)
- [Operações](docs/06-OPERATIONS.md)
## Desenvolvimento

```bash
# Ambiente de desenvolvimento
cd backend && npm run dev    # API em http://localhost:5000
cd frontend && npm run dev   # App em http://localhost:5173

# Testes
cd backend && npm test       # Testes funcionais
cd backend && npm run test:ci # Testes estruturais CI/CD

# Build produção
cd backend && npm run build
cd frontend && npm run build
```
## CI/CD Pipeline
O projeto inclui pipelines automatizados:

| Workflow      | Trigger  | Status                                                                                                                     |
|---------------|----------|----------------------------------------------------------------------------------------------------------------------------|
| **Lint & Build** | Push/PR  | [![CI/CD Status](https://github.com/victorlzfr/zyx-logistics-tracker/actions/workflows/lint-build.yml/badge.svg)]          |
| **Docker Build** | Tags v*  | [![Docker Build](https://github.com/victorlzfr/zyx-logistics-tracker/actions/workflows/docker-build.yml/badge.svg)]        |

Desenvolvido para: Teste técnico DHL (Analista de Sistemas Operacionais JR)
