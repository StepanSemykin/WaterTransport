// src/pages/OrderResponsesPage.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Spinner } from "react-bootstrap";

import Header from "../components/results/Header.jsx";
import styles from "./OfferResult.module.css"; // 👈 новый файл со стилями

const POLL_INTERVAL = 5000;

export default function OrderResponses() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (!polling) return;

    let cancelled = false;
    let intervalId;

    async function fetchResponses() {
      try {
        const res = await fetch("/api/rent-orders/Offers/foruser");

        if (res.status === 200) {
          const data = await res.json();
          if (cancelled) return;

          if (Array.isArray(data) && data.length > 0) {
            setResponses((prev) => {
              const map = new Map(prev.map((x) => [x.id, x]));
              data.forEach((item) => map.set(item.id, item));
              return Array.from(map.values()).sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
            });
          }
        }
      } catch (err) {
        console.error("Ошибка при опросе откликов:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchResponses();
    intervalId = setInterval(fetchResponses, POLL_INTERVAL);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [polling]);

  if (loading && responses.length === 0) {
    return (
      <div className={styles.page}>
        <Header />
        <Container className={styles.loadingContainer}>
          <Spinner animation="border" size="sm" />
          <span>Загрузка откликов...</span>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />

      <Container className={styles.container}>
        <div className={styles.headerBlock}>
          <h3 className={styles.title}>
            Ожидание откликов{" "}
            <span className={styles.subtitle}>({responses.length})</span>
          </h3>

          <div>
            {polling ? (
              <Badge bg="info">Автообновление каждые 5 секунд</Badge>
            ) : (
              <Badge bg="secondary">Обновление остановлено</Badge>
            )}
          </div>
        </div>

        {responses.length === 0 ? (
          <p className={styles.emptyMessage}>
            Пока нет откликов от партнёров.
          </p>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-3">
            {responses.map((resp) => (
              <Col key={resp.id}>
                <Card className={styles.card}>
                  <Card.Body>
                    <div className={styles.cardHeader}>
                      <div>
                        <Card.Title className={styles.shipName}>
                          {resp.shipName || "Судно без названия"}
                        </Card.Title>
                        <div className={styles.shipDetails}>
                          {resp.shipTypeName} • Заказ #{resp.rentOrderId}
                        </div>
                      </div>
                      <Badge bg="primary" className={styles.priceBadge}>
                        {resp.offeredPrice?.toLocaleString("ru-RU") ?? 0} ₽
                      </Badge>
                    </div>

                    <div className={styles.partnerInfo}>
                      Партнёр: <span>{resp.partnerName}</span>
                    </div>

                    <div className={styles.datesRow}>
                      <span>Создан: {formatDate(resp.createdAt)}</span>
                      <span>Ответ: {formatDate(resp.respondedAt)}</span>
                    </div>

                    <div className={styles.statusBlock}>
                      <Badge
                        bg={
                          resp.status === "approved"
                            ? "success"
                            : resp.status === "rejected"
                            ? "danger"
                            : "secondary"
                        }
                      >
                        {resp.status}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

// ⏱ Форматирование даты
function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
