# ==========================================
# HoneyMetrics Frontend - Multi-Stage Dockerfile
# ==========================================

# ETAPA 1: Dependencias base
FROM node:18-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# ETAPA 2: Desarrollo Local (Live Reload con Vite)
FROM base AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ETAPA 3: Builder de Producción (Compilación estática)
FROM base AS builder
COPY . .
RUN npm run build

# ETAPA 4: Runner de Producción (Servidor Nginx de Alto Desempeño)
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
