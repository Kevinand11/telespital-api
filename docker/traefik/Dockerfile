FROM traefik:3.0

ARG BASE_DOMAIN
ARG USE_SSL
ARG PORT
ENV BASE_DOMAIN $BASE_DOMAIN
ENV USE_SSL $USE_SSL
ENV PORT $PORT

COPY ./generate-conf.sh /etc/traefik/generate-conf.sh
RUN sh /etc/traefik/generate-conf.sh