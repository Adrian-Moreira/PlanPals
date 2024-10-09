FROM node:18.20.4-alpine

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

RUN npm install -g nodemon

RUN npm install -g typescript

COPY . .

RUN tsc

CMD [ "node", "out/app.js" ]
