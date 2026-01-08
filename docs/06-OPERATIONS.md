# Operações

## CI/CD Pipeline

### Workflows Implementados
1. **Lint & Build**: Valida TypeScript e build em push/PR
2. **Docker Build**: Constrói imagens Docker em tags

## Badges de Status
[![CI/CD](https://github.com/victorlzfr/zyx-logistics-tracker/actions/workflows/lint-build.yml/badge.svg)]
[![Docker](https://github.com/victorlzfr/zyx-logistics-tracker/actions/workflows/docker-build.yml/badge.svg)]

## Deploy

### Ambiente Local (Docker)
```bash
docker-compose up -d --build
```

## Considerações para Produção
- Uso de variáveis de ambiente seguras

- Configuração de HTTPS

- Backup do banco de dados

- Monitoramento (logs, métricas)
