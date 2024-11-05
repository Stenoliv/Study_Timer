# Stage 1: Build React app
FROM node:lts AS build
WORKDIR /app 
COPY package*.json ./  
RUN npm install  
COPY . . 
RUN npm run build  

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html 
# Copy the Nginx config
COPY nginx.conf /etc/nginx/templates/default.conf 
# Set the default server name; can be overridden
ENV SERVER_NAME=mydomain.com
ENV API_URL=http://localhost:${BACKEND_PORT}/api
ENV BACKEND_PORT=3000
ENV BACKEND_NAME=backend

CMD envsubst '$SERVER_NAME $BACKEND_PORT $BACKEND_NAME' < /etc/nginx/templates/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'