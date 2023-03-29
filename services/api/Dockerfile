FROM node:18.15.0-alpine3.17 as base
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .

FROM base as production
RUN yarn build