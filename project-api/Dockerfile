
   
FROM balenalib/raspberrypi3-node:10.18

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY ./server ./server
RUN npm i
RUN pwd && ls -al && ls -al server

CMD ["node", "server/index.js"]