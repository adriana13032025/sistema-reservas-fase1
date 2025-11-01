# 1. Fase de Construcción (Build Stage)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 

# 2. Fase de Producción (Production Stage)
FROM nginx:alpine
# Copia la carpeta de producción ('dist')
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]
