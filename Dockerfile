FROM node:22-alpine AS node_base

FROM node_base as stage-dependencies
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . /usr/app/
RUN npm install
RUN echo $API_URL

# FROM node_base as stage-build
# WORKDIR /usr/app
# COPY . /usr/app
# COPY --from=stage-dependencies /usr/app/node_modules /usr/app/node_modules
ARG API_URL="http://localhost"
ENV API_URL=${API_URL}
ARG USER_ID=""
ENV USER_ID=${USER_ID}
RUN npm run build

FROM nginx:alpine
# COPY --from=stage-build /usr/app/dist /usr/share/nginx/html
COPY --from=stage-dependencies /usr/app/dist /usr/share/nginx/html
RUN chown -R nginx /usr/share/nginx/html

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
