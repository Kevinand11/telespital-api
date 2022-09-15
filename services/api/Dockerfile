FROM node:18-alpine as base
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .

FROM base as production
RUN yarn build