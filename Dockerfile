FROM node:20

WORKDIR /usr/src/app

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod
RUN pnpm migrate

COPY . .

EXPOSE 3000
CMD [ "pnpm", "start" ]