FROM node:16-alpine

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY . .

RUN node --version
RUN yarn --version

RUN yarn install
RUN yarn build

EXPOSE 4000
CMD ["yarn", "start"]
