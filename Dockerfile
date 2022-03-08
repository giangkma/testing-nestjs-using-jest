# pull official base image
FROM node:14-alpine

ENV COMPOSE_HTTP_TIMEOUT=50000

# set working directory
WORKDIR /usr/app
# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/app/node_modules/.bin:$PATH

COPY . .
RUN yarn init-env

RUN yarn build

EXPOSE 3000

ARG DATABASE_PASSWORD
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}

ARG AZURE_AD_CLIENT_SECRET
ENV AZURE_AD_CLIENT_SECRET=${AZURE_AD_CLIENT_SECRET}

ARG SENDGRID_API_KEY
ENV SENDGRID_API_KEY=${SENDGRID_API_KEY}

ARG STORAGE_ACCOUNT_KEY
ENV STORAGE_ACCOUNT_KEY=${STORAGE_ACCOUNT_KEY}

# start app
CMD ["yarn", "start:prod"]
