FROM node:8

MAINTAINER duncan nevin <duncan.nevin@gmail.com>

WORKDIR /usr/src/app/websocket_client

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn run build
EXPOSE 3000
CMD ["yarn", "run"]
