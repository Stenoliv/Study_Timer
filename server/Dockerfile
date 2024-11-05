FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY /src ./src
RUN npm run build

# Stage 2: Serve the application
FROM node:18-alpine
WORKDIR /src
COPY --from=build /app/dist/src ./
COPY --from=build /app/node_modules ./node_modules
ENV PORT=${POST}
EXPOSE 5000
CMD ["node", "index.js"] 