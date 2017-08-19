# pclubiitk/student-search:frontend
FROM nginx
RUN apt-get update
RUN apt-get -y install gnupg && apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get install -y nodejs

# Install yarn and ng-cli
RUN npm install -g yarn @angular/cli

# Cached layer for node_modules
COPY package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

WORKDIR /src
ADD . /src
RUN cd /src && yarn build:deploy

COPY nginx.conf /etc/nginx/nginx.conf
