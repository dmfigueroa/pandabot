FROM node:20-alpine

WORKDIR /usr/src/app

ENV NPM_CONFIG_PREFIX="/home/node/.npm-global"
ENV PNPM_HOME="/.pnpm"
ENV PATH="${PATH}:${PNPM_HOME}:/home/node/.npm-global/bin"

COPY package.json pnpm-lock.yaml ./
RUN npm install --global pnpm

RUN pnpm install --frozen-lockfile 

COPY . .

RUN pnpm generate 
RUN pnpm migrate

EXPOSE 3000
CMD [ "pnpm", "start" ]