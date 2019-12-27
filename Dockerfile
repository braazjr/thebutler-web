FROM node:10-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@7.3.9

COPY . /app

RUN npm run build:develop

EXPOSE 4200

CMD ["npm", "run", "start"]