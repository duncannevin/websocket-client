FROM node:8

MAINTAINER duncan nevin <duncan.nevin@gmail.com>

WORKDIR /usr/src/app/websocket_client

COPY package.json yarn.lock ./
RUN npm install
RUN npm audit fix
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
