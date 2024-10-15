# server/Dockerfile
FROM node:16

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

CMD [ "node", "src/index.js" ]