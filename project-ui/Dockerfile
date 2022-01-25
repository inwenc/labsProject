FROM balenalib/raspberrypi4-64-alpine-node
WORKDIR /project-ui

# install node dependencies
COPY package.json package-lock.json ./
RUN npm i

# run app (dev mode)
COPY ./tsconfig.json ./tsconfig.json
COPY ./public ./public
COPY ./src ./src
CMD ["npm", "start"]
