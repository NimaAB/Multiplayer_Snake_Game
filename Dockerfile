FROM node:16-alpine3.11


RUN apk upgrade --update-cache --available
#installing nginx
RUN apk --no-cache add nginx
RUN apk add openssl



COPY . /app/
COPY nginx /etc/nginx
RUN chmod 700 /etc/nginx/ssl
RUN openssl req -x509 -nodes -days 356 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx-selfsigned.key -out /etc/nginx/ssl/nginx-selfsigned.crt 


WORKDIR /app
RUN npm install

EXPOSE 5000
CMD ["node", "server.js"]