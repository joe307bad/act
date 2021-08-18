FROM node:12.19.0-alpine3.9

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR ${ACT_SRC}

RUN yarn install --production=true
RUN yarn build:api

CMD ["node", "dist/apps/api/src/main"]
