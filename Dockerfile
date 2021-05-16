FROM ubuntu:latest
WORKDIR /snake_game
COPY package.json .


RUN apt-get update -y
RUN apt-get install -y nginx curl
RUN apt-get install -y build-essential
#RUN curl -sL https://deb.nodesource.com/setup_11.x
RUN apt-get install -y nodejs npm


RUN npm install
COPY ../ .
EXPOSE 5000
CMD ["node", "server.js"]

#not done yet!
