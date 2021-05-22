FROM node:16-alpine3.11

ENV MONGO_DB_USERNAME=groupe25
ENV MONGO_DB_PWD=groupe25


#installing nginx
RUN apk --no-cache add nginx

COPY . /app/
COPY docker-nginx.conf /etc/nginx/nginx.conf

WORKDIR /app
RUN npm install

EXPOSE 5000
CMD ["node", "server.js"]
