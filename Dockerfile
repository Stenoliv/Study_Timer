# Dockerfile
# Build React frontend
FROM node:16 AS build-frontend

WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build Express backend
FROM node:16 AS build-backend

WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server/ ./

# Production image
FROM nginx:alpine

# Copy React build to nginx
COPY --from=build-frontend /app/client/build /usr/share/nginx/html

# Copy Express app
WORKDIR /app/server
COPY --from=build-backend /app/server .

# Start Express app
CMD ["node", "src/index.js"]