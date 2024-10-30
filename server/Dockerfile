# Stage 1: Build the backend
FROM node:18 AS backend-build
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build

# Stage 2: Serve the application
FROM node:18
WORKDIR /app
COPY --from=backend-build /app/dist ./dist
COPY --from=backend-build /app/node_modules ./node_modules
CMD ["node", "dist/app.js"] 
