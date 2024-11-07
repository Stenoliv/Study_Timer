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
WORKDIR /src
COPY --from=backend-build /app/dist/src ./
COPY --from=backend-build /app/node_modules ./node_modules
ENV PORT=${PORT}
EXPOSE 5000
CMD ["node", "index.js"] 
