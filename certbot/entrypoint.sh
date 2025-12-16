#!/bin/sh
set -eu

: "${DOMAIN:?DOMAIN is required}"
: "${API_DOMAIN:?API_DOMAIN is required}"
: "${EMAIL:?EMAIL is required}"

mkdir -p /var/www/certbot

# Ждём, пока nginx начнёт слушать 80 (для HTTP-01)
echo "[certbot] waiting nginx on port 80..."
i=0
while true; do
  # Внутри docker-сети nginx доступен по имени "nginx"
  if wget -qO- "http://nginx/.well-known/acme-challenge/" >/dev/null 2>&1; then
    break
  fi
  i=$((i+1))
  if [ "$i" -gt 60 ]; then
    echo "[certbot] nginx not ready after 60 tries"
    break
  fi
  sleep 2
done

issue_if_missing () {
  d="$1"
  if [ ! -f "/etc/letsencrypt/live/$d/fullchain.pem" ]; then
    echo "[certbot] issuing certificate for $d"
    certbot certonly --webroot -w /var/www/certbot \
      -d "$d" \
      --email "$EMAIL" --agree-tos --no-eff-email \
      --non-interactive \
      || echo "[certbot] issuance failed for $d (will retry later)"
  else
    echo "[certbot] certificate already exists for $d"
  fi
}

# Пытаемся получить сертификаты (если DNS/порты не готовы — certbot ошибётся, но сервис будет ретраить)
issue_if_missing "$DOMAIN"
issue_if_missing "$API_DOMAIN"

# Авто-renew в цикле
while true; do
  echo "[certbot] renew check..."
  certbot renew --webroot -w /var/www/certbot --quiet || true
  sleep 12h
done