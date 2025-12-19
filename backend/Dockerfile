FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY src/ ./src/

# Expor porta
EXPOSE 5000

# Variáveis de ambiente
ENV NODE_ENV=development

# Comando com nodemon para hot-reload
CMD ["npm", "run", "dev"]
