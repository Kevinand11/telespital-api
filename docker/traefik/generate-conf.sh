#!/bin/sh

CONF_PATH=/etc/traefik/traefik.yml

CERT_TYPE=production

CERT_PATH_STAGING=/etc/traefik/acmeStaging.json
CERT_PATH_PRODUCTION=/etc/traefik/acmeProduction.json

if [ "$USE_SSL" = 1 ]; then
cat > $CONF_PATH <<- EOF
global:
  checkNewVersion: true
  sendAnonymousUsage: false

entryPoints:
  web:
    address: :80

  websecure:
    address: :443

http:
  middlewares:
    stripRoutePrefix:
      stripPrefix:
        prefixes:
          - "/api"
  routers:
    api:
      tls:
        certresolver: $CERT_TYPE
      rule: "Host(\`$BASE_DOMAIN\`) && PathPrefix(\`/api/\`)"
      middlewares:
        - stripRoutePrefix
      service: api

  services:
    api:
      loadBalancer:
        servers:
          - url: http://api:$PORT/

api:
  insecure: true
  dashboard: true

providers:
  file:
    directory: /etc/traefik
    watch: true

certificatesResolvers:
  staging:
    acme:
      email: no-reply@stranerd.com
      storage: $CERT_PATH_STAGING
      caServer: "https://acme-staging-v02.api.letsencrypt.org/directory"
      httpChallenge:
        entryPoint: web

  production:
    acme:
      email: no-reply@stranerd.com
      storage: $CERT_PATH_PRODUCTION
      caServer: "https://acme-v02.api.letsencrypt.org/directory"
      httpChallenge:
        entryPoint: web
EOF
else
cat > $CONF_PATH <<- EOF
global:
  checkNewVersion: true
  sendAnonymousUsage: false

entryPoints:
  web:
    address: :80

http:
  middlewares:
    stripRoutePrefix:
      stripPrefix:
        prefixes:
          - "/api"
  routers:
    api:
      rule: "PathPrefix(\`/api/\`)"
      middlewares:
        - stripRoutePrefix
      service: api

  services:
    api:
      loadBalancer:
        servers:
          - url: http://api:$PORT/

api:
  insecure: true
  dashboard: true

providers:
  file:
    directory: /etc/traefik
    watch: true
EOF
fi