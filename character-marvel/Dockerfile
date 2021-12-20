FROM node:12.22.3-alpine

WORKDIR /app

COPY ./ ./

ENV PATH /app/node_modules/.bin:$PATH
RUN npm install --silent
RUN npm i -g @nestjs/cli

EXPOSE 8080

CMD ["npm", "run", "start"]