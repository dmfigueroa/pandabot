FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm i -g yarn

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn migrate
RUN yarn build

EXPOSE 80

CMD [ "yarn", "start" ]