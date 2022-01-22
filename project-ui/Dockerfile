FROM node:15.13-alpine
WORKDIR /project-ui
ENV PATH="./node_modules/.bin:$PATH"
COPY . .
RUN npm install
CMD ["npm", "start"]
