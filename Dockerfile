FROM node:10-alpine AS builder

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app
RUN npm run build:develop

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/* /usr/share/nginx/html/
RUN chmod 777 -R /usr/share/nginx/html

COPY --from=builder /app/custom-nginx-file.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]