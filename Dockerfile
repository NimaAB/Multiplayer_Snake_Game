FROM node:16-alpine3.11

#installing nginx
RUN apk --no-cache add nginx

COPY . /app/
COPY docker-nginx.conf /etc/nginx/nginx.conf

WORKDIR /app
RUN npm install

EXPOSE 5000
CMD ["node", "server.js"]
