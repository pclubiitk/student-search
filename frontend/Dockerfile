# pclubiitk/student-search:frontend

### STAGE 1: Build ###
FROM node:6.16-alpine AS build
WORKDIR /usr/src/app
RUN npm install -g yarn @angular/cli
COPY yarn.lock package.json ./
RUN yarn install
COPY . .
RUN yarn build:deploy

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
