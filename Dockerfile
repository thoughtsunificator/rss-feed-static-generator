# node:22-alpine amd64
FROM node@sha256:fc95a044b87e95507c60c1f8c829e5d98ddf46401034932499db370c494ef0ff AS node

WORKDIR /app

ENV NODE_ENV="production"

COPY package-lock.json package.json ./

RUN npm ci

COPY . .

CMD [ "npm", "run", "build" ]

