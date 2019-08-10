FROM node:10-alpine

WORKDIR /agcombo-restart
COPY package.json /agcombo-restart

RUN npm install
COPY . /agcombo-restart

ARG user
ARG pass
ARG times=5

CMD node index.js $user $pass $times