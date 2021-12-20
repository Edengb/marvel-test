FROM node:12.22.3-alpine

WORKDIR /app

COPY package.json .

COPY ./ ./

RUN npm install

ENTRYPOINT npm start

EXPOSE 3000

