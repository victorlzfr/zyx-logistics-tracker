## Conquista
Configuração inicial completa do backend Node.js/Express para o sistema ZYX Logistics Tracker, incluindo conexão com PostgreSQL via Docker e estrutura básica da API.

## Data: 03-12-2025
## Tempo Gasto: 52 minutos

## Processo Concluído

1. **Configuração do Ambiente Backend**
   - Criação e correção do arquivo `.env` com variáveis de ambiente para banco de dados e servidor
   - Explicação sobre variáveis: `PORT=5000` (porta API), `NODE_ENV=development` (ambiente), `JWT_SECRET` (futura autenticação)
   - Criação de `.gitignore` para proteger arquivos sensíveis (node_modules, .env)

2. **Configuração do Projeto Node.js**
   - Correção de problemas com `package.json` duplicado (um na raiz e outro em `src/`)
   - Explicação sobre `npm` (Node Package Manager) e sua função
   - Instalação de dependências: express, pg (PostgreSQL), dotenv, cors, nodemon
   - Correção de erro `JSONPARSE` no `package.json` (removidos comentários inválidos em JSON)
   - Explicação sobre `package-lock.json` (gerado automaticamente para travar versões)

3. **Estruturação do Backend**
   - Criação da estrutura de pastas: `src/` com subpastas controllers, models, routes, middleware, db, utils
   - Implementação de `src/server.js` com servidor Express básico
   - Implementação de `src/db/connection.js` com pool de conexões PostgreSQL
   - Configuração de rotas: `/api/health` (health check) e `/` (raiz)
   - Implementação de middleware CORS e JSON parsing

4. **Resolução de Dúvidas Técnicas**
   - Explicação sobre comentários em arquivos `.env` (funcionam com `#`)
   - Diferença entre licenças MIT e ISC para projetos open source
   - Explicação sobre JWT (JSON Web Tokens) e autenticação futura
   - Correção de problemas de codificação em arquivos

