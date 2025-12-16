#!/usr/bin/env bash
set -euo pipefail

: "${DOMAIN:?DOMAIN is required}"
: "${API_DOMAIN:?API_DOMAIN is required}"

mkdir -p /var/www/certbot

# Стартуем в HTTP-режиме (только для challenge + прокси),
# чтобы certbot смог получить сертификаты.
envsubst '${DOMAIN} ${API_DOMAIN}' \
  < /etc/nginx/templates/default-http.conf.template \
  > /etc/nginx/conf.d/default.conf

# Запускаем watcher, который переключит nginx на HTTPS, когда появятся сертификаты
(
  echo "[nginx] waiting for certificates..."
  while true; do
    if [[ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" && -f "/etc/letsencrypt/live/${DOMAIN}/privkey.pem" \
       && -f "/etc/letsencrypt/live/${API_DOMAIN}/fullchain.pem" && -f "/etc/letsencrypt/live/${API_DOMAIN}/privkey.pem" ]]; then
      echo "[nginx] certificates found, enabling HTTPS config"
      envsubst '${DOMAIN} ${API_DOMAIN}' \
        < /etc/nginx/templates/default-https.conf.template \
        > /etc/nginx/conf.d/default.conf
      nginx -s reload || true
      break
    fi
    sleep 5
  done

  # Дальше просто периодически reload (на случай renew)
  while true; do
    sleep 6h
    nginx -s reload || true
  done
) &

exec nginx -g "daemon off;"