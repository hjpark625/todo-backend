FROM node:16-alpine

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .


RUN node --version
RUN yarn --version

RUN yarn install
RUN yarn build

COPY . .

EXPOSE 4000
ENTRYPOINT ["yarn", "start"]
