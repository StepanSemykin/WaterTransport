FROM nginx:stable-alpine

# bash нужен для start.sh, gettext дает envsubst
RUN apk add --no-cache bash gettext

# Шаблоны конфигов nginx
COPY templates /etc/nginx/templates

# Стартовый скрипт, который генерит /etc/nginx/conf.d/default.conf и делает reload
COPY start.sh /start.sh
RUN chmod +x /start.sh

ENTRYPOINT ["/start.sh"]