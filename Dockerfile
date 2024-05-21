#React app image
FROM node:lts-alpine as build

WORKDIR /src

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build