FROM node:22-alpine

RUN apk update && apk upgrade && \
  apk add --no-cache sqlite g++ make python3

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev


COPY . .

EXPOSE 3000

CMD ["npm", "start"]