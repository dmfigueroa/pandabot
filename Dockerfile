FROM node:20

WORKDIR /usr/src/app

RUN curl -fsSL https://get.pnpm.io/install.sh | sh -

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod
RUN pnpm migrate
RUN pnpm build

COPY . .

EXPOSE 80
CMD [ "pnpm", "start" ]