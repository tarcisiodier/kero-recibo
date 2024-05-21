#React app image
FROM node:lts-alpine as build
FROM nginx:latest as prod

WORKDIR /

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

COPY --from=build /build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]