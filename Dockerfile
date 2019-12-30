FROM node:10-alpine AS builder

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app
RUN npm run build:develop

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/butler-web /usr/share/nginx/html/
RUN ls -l /usr/share/nginx/html/

EXPOSE 80