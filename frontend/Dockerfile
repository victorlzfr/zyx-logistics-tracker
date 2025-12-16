FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar configurações e código
COPY . .

# Expor porta do Vite
EXPOSE 5173

# Variável de ambiente para API
ENV VITE_API_URL=http://backend:5000/api

# Comando de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
