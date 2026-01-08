# Arquitetura do Sistema

## Visão Geral
O ZYX Logistics Tracker é uma aplicação full-stack para rastreamento de cargas.

## Stack Tecnológica
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Banco de Dados**: PostgreSQL
- **Automação/Integração**: n8n
- **Infraestrutura**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## Decisões de Arquitetura
- **TypeScript em toda a stack** para segurança de tipos.
- **Containerização com Docker** para ambiente reproduzível.
- **n8n para automações** que interagem com a API.
- **API RESTful** como camada de integração única.
