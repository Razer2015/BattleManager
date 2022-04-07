FROM node:lts-alpine3.15 AS build-deps
WORKDIR /app

COPY package*.json ./

RUN npm ci --loglevel error --production

# Build stage
FROM build-deps AS builder

ARG REACT_APP_GRAPHQL_HOST

RUN echo "REACT_APP_GRAPHQL_HOST=$REACT_APP_GRAPHQL_HOST" >> .env

COPY . /app
WORKDIR /app

RUN REACT_APP_GRAPHQL_HOST=$REACT_APP_GRAPHQL_HOST npm run build

# Choose NGINX as our base Docker image
FROM nginx:alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf *

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /app/build .

EXPOSE 3000
# Entry point when Docker container has started
ENTRYPOINT ["nginx", "-g", "daemon off;"]
