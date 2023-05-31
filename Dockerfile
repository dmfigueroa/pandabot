FROM node:20

WORKDIR /usr/src/app

RUN curl -f https://get.pnpm.io/v8.4.0.js | node - add --global pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod
RUN pnpm migrate
RUN pnpm build

COPY . .

EXPOSE 80
CMD [ "pnpm", "start" ]