# Stage 1: Build the backend
FROM node:18 AS backend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY /src ./src
RUN npm run build

# Stage 2: Serve the application
FROM node:18
WORKDIR /app
COPY --from=backend-build /app/dist ./dist
COPY --from=backend-build /app/node_modules ./node_modules
ENV PORT=${POST}
EXPOSE 5000
CMD ["node", "dist/index.js"] 
