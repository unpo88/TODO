FROM node:12-alpine as builder

WORKDIR /client

COPY package*.json /client/package.json

RUN npm install

COPY . /client

RUN npm run build --production

FROM nginx:1.25.1-alpine3.17-slim

RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

WORKDIR /client

COPY dist/ dist/

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]