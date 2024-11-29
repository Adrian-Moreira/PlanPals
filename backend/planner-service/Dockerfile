FROM node:18.20.4-alpine

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

RUN npm install -g nodemon

RUN npm install -g typescript

RUN npm install -g ts-node

COPY . .

EXPOSE 8080

CMD [ "ts-node", "src/app.ts" ]
