FROM node:12.19.0-alpine3.9

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR "/app"

RUN apk add git
COPY package.json yarn.lock ./
RUN yarn install --production

COPY dist/apps/api ./

CMD ["node", "main"]
