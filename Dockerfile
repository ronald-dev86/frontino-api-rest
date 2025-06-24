# Etapa de construcción
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm install -g @nestjs/cli 

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src/ ./src/

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /app

# Copiar archivos de configuración y dependencias desde la etapa de construcción
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist/ ./dist/

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Exponer el puerto donde se ejecuta la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"] 