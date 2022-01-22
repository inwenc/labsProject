
   
FROM balenalib/raspberrypi3-64-alpine-node

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY ./server ./server
RUN npm i
RUN pwd && ls -al && ls -al server

CMD ["node", "server/index.js"]