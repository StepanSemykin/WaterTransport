# /home/stepan/WaterTransport/scripts/init-letsencrypt.sh
#!/bin/bash

# Скрипт для первичной настройки Let's Encrypt
# Использование: ./scripts/init-letsencrypt.sh

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Инициализация Let's Encrypt ===${NC}"

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo -e "${YELLOW}Файл .env не найден. Создаём из .env.example...${NC}"
    cp .env.example .env
    echo -e "${RED}ВНИМАНИЕ: Отредактируйте .env файл и укажите ваши домены и email!${NC}"
    echo -e "${RED}После этого запустите скрипт снова.${NC}"
    exit 1
fi

# Загрузка переменных из .env
source .env

# Проверка обязательных переменных
if [ -z "$DOMAIN" ] || [ -z "$API_DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo -e "${RED}Ошибка: Переменные DOMAIN, API_DOMAIN и EMAIL должны быть установлены в .env${NC}"
    exit 1
fi

if [ "$DOMAIN" = "example.com" ]; then
    echo -e "${RED}Ошибка: Вы не изменили DOMAIN в .env файле!${NC}"
    exit 1
fi

echo -e "${GREEN}Используемые домены:${NC}"
echo -e "  Frontend: ${DOMAIN}"
echo -e "  API: ${API_DOMAIN}"
echo -e "  Email: ${EMAIL}"
echo ""

# Создание необходимых директорий
echo -e "${GREEN}Создание директорий...${NC}"
mkdir -p certbot/www/.well-known/acme-challenge

# Запуск базовой инфраструктуры
echo -e "${GREEN}Запуск Docker контейнеров...${NC}"
docker compose up -d postgres api client nginx

# Ожидание готовности nginx
echo -e "${YELLOW}Ожидание готовности nginx (5 секунд)...${NC}"
sleep 5

# Тестирование ACME challenge endpoint
echo -e "${GREEN}Тестирование доступности ACME challenge...${NC}"
echo "test-acme-challenge" > certbot/www/.well-known/acme-challenge/test

if curl -f -s "http://${DOMAIN}/.well-known/acme-challenge/test" > /dev/null; then
    echo -e "${GREEN}✓ ACME challenge endpoint доступен${NC}"
    rm certbot/www/.well-known/acme-challenge/test
else
    echo -e "${RED}✗ ACME challenge endpoint недоступен${NC}"
    echo -e "${RED}Проверьте DNS настройки и доступность порта 80${NC}"
    exit 1
fi

# Получение сертификатов
echo -e "${GREEN}Запрос сертификатов Let's Encrypt...${NC}"
echo -e "${YELLOW}Это может занять несколько минут...${NC}"

docker compose run --rm certbot certonly --webroot \
    -w /var/www/certbot \
    -d "${DOMAIN}" \
    -d "${API_DOMAIN}" \
    --email "${EMAIL}" \
    --agree-tos \
    --no-eff-email \
    --non-interactive

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Сертификаты успешно получены!${NC}"
    
    # Перезагрузка nginx
    echo -e "${GREEN}Перезагрузка nginx...${NC}"
    docker compose exec nginx nginx -s reload
    
    # Запуск certbot для автообновления
    echo -e "${GREEN}Запуск сервиса автообновления сертификатов...${NC}"
    docker compose up -d certbot
    
    echo -e "${GREEN}=== Настройка завершена успешно! ===${NC}"
    echo -e "${GREEN}Ваш сайт доступен по адресу: https://${DOMAIN}${NC}"
    echo -e "${GREEN}API доступен по адресу: https://${API_DOMAIN}${NC}"
else
    echo -e "${RED}✗ Ошибка при получении сертификатов${NC}"
    echo -e "${YELLOW}Проверьте логи для диагностики:${NC}"
    echo -e "  docker compose logs nginx"
    echo -e "  docker compose logs certbot"
    exit 1
fi