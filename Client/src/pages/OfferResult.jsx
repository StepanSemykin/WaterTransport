import { useEffect, useState } from "react";

import { Container, Row, Col, Card, Badge, Spinner, Button } from "react-bootstrap";

import { apiFetch } from "../api/api.js";
import { useAuth } from "../components/auth/AuthContext.jsx";

import Header from "../components/results/Header.jsx";

import styles from "./OfferResult.module.css";

const POLL_INTERVAL = 10000; // 10 секунд

const USER_OFFERS_ENDPOINT = "/api/rent-orders/offers/foruser";
const OFFERS_ENDPOINT = "/api/rent-orders/Offers";
const RENT_ORDERS_ENDPOINT = "/api/rentorders";
const ACCEPT_ENDPOINT = "accept";
const REJECT_ENDPOINT = "reject";
const CANCEL_ENDPOINT = "cancel";

export default function OrderResponses() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);

  const [rentOrderId, setRentOrderId] = useState(null);
  const { activeRentOrder, hasActiveOrder, loadActiveOrder, role } = useAuth();

  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelled, setCancelled] = useState(false);

  // Берём rentOrderId из активного заказа в контексте
  useEffect(() => {
    if (!rentOrderId) {
      const ctxId = activeRentOrder?.id ?? activeRentOrder?.Id;
      if (ctxId) setRentOrderId(String(ctxId));
    }
  }, [activeRentOrder, rentOrderId]);

  // Если не удалось — берём из первого отклика
  useEffect(() => {
    if (!rentOrderId && responses.length > 0) {
      const fromResp = responses[0]?.rentOrderId;
      if (fromResp) setRentOrderId(String(fromResp));
    }
  }, [responses, rentOrderId]);

  // ✅ Принять отклик (accept)
  async function handleApprove(offerId, rentOrderId) {
    if (!offerId || !rentOrderId) return;

    try {
      const url = `${OFFERS_ENDPOINT}/${offerId}/${ACCEPT_ENDPOINT}?rentOrderId=${encodeURIComponent(
        rentOrderId
      )}`;

      const res = await apiFetch(url, {
        method: "POST",
      });

      if (res.ok) {
        setResponses((prev) =>
          prev.map((r) =>
            r.id === offerId ? { ...r, status: "approved" } : r
          )
        );
        // при желании можно остановить polling или перезагрузить активный заказ:
        // setPolling(false);
        // loadActiveOrder?.();
      } else {
        const txt = await res.text().catch(() => "");
        console.error(
          "Ошибка подтверждения. Статус:",
          res.status,
          txt || ""
        );
      }
    } catch (err) {
      console.error("Ошибка при подтверждении отклика:", err);
    }
  }

  // ❌ Отклонить отклик (reject)
  async function handleReject(offerId, rentOrderId) {
    if (!offerId || !rentOrderId) return;

    try {
      const url = `${OFFERS_ENDPOINT}/${offerId}/${REJECT_ENDPOINT}?rentOrderId=${encodeURIComponent(
        rentOrderId
      )}`;

      const res = await apiFetch(url, {
        method: "POST",
      });

      if (res.ok) {
        setResponses((prev) =>
          prev.map((r) =>
            r.id === offerId ? { ...r, status: "rejected" } : r
          )
        );
      } else {
        const txt = await res.text().catch(() => "");
        console.error("Ошибка отклонения. Статус:", res.status, txt || "");
      }
    } catch (err) {
      console.error("Ошибка при отклонении отклика:", err);
    }
  }

  // Отмена заявки на аренду
  async function handleCancelOrder() {
    if (!rentOrderId) return;
    setCanceling(true);
    setCancelError("");

    try {
      const res = await apiFetch(
        `${RENT_ORDERS_ENDPOINT}/${encodeURIComponent(
          rentOrderId
        )}/${CANCEL_ENDPOINT}`,
        { method: "POST" }
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      setPolling(false);
      setResponses([]);
      setCancelled(true);
    } catch (err) {
      setCancelError(err?.message || "Не удалось отменить заявку");
    } finally {
      setCanceling(false);
    }
  }

  // Пуллинг откликов для текущего пользователя
  useEffect(() => {
    if (!polling) return;

    let cancelledFlag = false;
    let intervalId;

    async function fetchResponses() {
      try {
        const res = await apiFetch(USER_OFFERS_ENDPOINT, { method: "GET" });

        if (cancelledFlag) return;

        if (res.status === 200) {
          const data = await res.json();
          console.log(data);

          if (Array.isArray(data)) {
            setResponses(
              data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              )
            );
          }
        }
      } catch (err) {
        console.error("Ошибка при опросе откликов:", err);
      } finally {
        if (!cancelledFlag) setLoading(false);
      }
    }

    // первый запрос сразу
    fetchResponses();
    // последующие — каждые POLL_INTERVAL мс
    intervalId = setInterval(fetchResponses, POLL_INTERVAL);

    return () => {
      cancelledFlag = true;
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

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {cancelled ? (
              <Badge bg="danger">Заявка отменена</Badge>
            ) : (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleCancelOrder}
                disabled={!rentOrderId || canceling}
                title={
                  rentOrderId
                    ? "Отменить текущую заявку"
                    : "Идентификатор заявки не найден"
                }
              >
                {canceling ? "Отмена..." : "Отменить заявку"}
              </Button>
            )}
            {polling ? (
              <Badge bg="info">
                Автообновление каждые {POLL_INTERVAL / 1000} секунд
              </Badge>
            ) : (
              <Badge bg="secondary">Обновление остановлено</Badge>
            )}
          </div>
        </div>

        {cancelError && (
          <div
            className="alert alert-danger"
            role="alert"
            style={{ marginBottom: 12 }}
          >
            {cancelError}
          </div>
        )}

        {loading && responses.length === 0 ? (
          <div className={styles.loadingContainer}>
            <Spinner animation="border" size="sm" />
            <span>Загрузка откликов...</span>
          </div>
        ) : responses.length === 0 ? (
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

                    <div className={styles.actionsRow}>
                      <button
                        className={styles.approveButton}
                        onClick={() =>
                          handleApprove(resp.id, resp.rentOrderId)
                        }
                        disabled={resp.status === "approved"}
                      >
                        Подтвердить
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={() =>
                          handleReject(resp.id, resp.rentOrderId)
                        }
                        disabled={resp.status === "rejected"}
                      >
                        Отклонить
                      </button>
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
    minute: "2-digit",
  });
}
