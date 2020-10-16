# pclubiitk/student-search:frontend

### STAGE 1: Build ###
FROM node:12-alpine3.12 AS build
WORKDIR /usr/src/app
RUN npm install -g @angular/cli
COPY package-lock.json package.json ./
RUN npm install
COPY . .
RUN npm run build:deploy

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
