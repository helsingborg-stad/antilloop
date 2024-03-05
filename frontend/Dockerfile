FROM node:18.12.0 as build-deps

ARG VITE_APP_API_URI
ARG VITE_APP_GOOGLE_CLIENT_ID


WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:alpine

WORKDIR /usr/src/app
COPY --from=build-deps /usr/src/app ./
EXPOSE 80
EXPOSE 443
