import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { ArrowLeft, User as UserIcon, Home, ArrowDownUp } from 'lucide-react';
import { Container, Row, Col, Card, Badge, Spinner, Button } from "react-bootstrap";

import { apiFetch } from "../api/api.js";
import { useAuth } from "../components/auth/AuthContext.jsx";

import ShipCard from "../components/dashboards/ShipCard.jsx"; 
import ShipDetails from "../components/dashboards/ShipDetails.jsx";

import styles from "./OfferResult.module.css";

import ShipIcon from "../assets/ship.png";
import CostIcon from "../assets/cost.png";

const POLL_INTERVAL = 10000; // 10 секунд

const USER_OFFERS_ENDPOINT = "/api/rent-orders/offers/foruser";
const OFFERS_ENDPOINT = "/api/rent-orders/Offers";
const RENT_ORDERS_ENDPOINT = "/api/rentorders";
const SHIP_REVIEWS_ENDPOINT = "/api/reviews/ship";
const ACCEPT_ENDPOINT = "accept";
const REJECT_ENDPOINT = "reject";
const CANCEL_ENDPOINT = "cancel";

const FORMAT_IMG = "base64";

export default function OfferResult() {
  const navigate = useNavigate();

  const [shipReviews, setShipReviews] = useState([]);
  const [shipReviewsLoading, setShipReviewsLoading] = useState(false);

  const [showShipModal, setShowShipModal] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);

  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [decisionLoading, setDecisionLoading] = useState(false);

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

  function openShipModal(resp) {
    setSelectedShip({
      primaryImageUrl: resp?.ship?.primaryImageUrl?.url ?? resp?.ship?.primaryImageUrl ?? "",
      primaryImageMimeType: resp?.ship?.primaryImageMimeType,
      name: resp?.ship?.name ?? resp?.shipName,
      shipTypeName: resp?.ship?.shipTypeName ?? resp?.shipTypeName,
      capacity: resp?.ship?.capacity,
      maxSpeed: resp?.ship?.maxSpeed,
      yearOfManufacture: resp?.ship?.yearOfManufacture,
      description: resp?.ship?.description
    });
    setSelectedOfferId(resp?.id ?? null);
    loadShipReviews(resp.shipId);
    setShowShipModal(true);
  }

  function closeShipModal() {
    setShowShipModal(false);
    setSelectedShip(null);
    setSelectedOfferId(null);
    setDecisionLoading(false);
  }

  async function handleApproveInModal() {
    if (!selectedOfferId || !rentOrderId) return;
    try {
      setDecisionLoading(true);
      await handleApprove(selectedOfferId, rentOrderId);
      closeShipModal();
    } 
    finally {
      setDecisionLoading(false);
    }
  }

  async function handleRejectInModal() {
    if (!selectedOfferId || !rentOrderId) return;
    try {
      setDecisionLoading(true);
      await handleReject(selectedOfferId, rentOrderId);
      closeShipModal();
    } 
    finally {
      setDecisionLoading(false);
    }
  }

  function mapOfferToTripCard(resp) {
    return {
      imageSrc: `data:${resp?.ship?.primaryImageMimeType};${FORMAT_IMG},${resp?.ship?.primaryImageUrl}`,
      imageAlt: resp.ship.name || "Судно",
      name: { iconSrc: ShipIcon, iconAlt: "судно", text: resp.ship.name || "Без названия" },
      type: { iconSrc: ShipIcon, iconAlt: "судно", text: resp.ship.shipTypeName || "Не указан" },
      details: [
        { iconSrc: CostIcon, iconAlt: "Стоимость", text: `Цена: ${resp.offeredPrice}` },
        // { iconSrc: PassengersIcon, iconAlt: "пассажиры", text: `До ${resp.ship.capacity || 0} человек` }
      ],
      actions: [
        { key: "details", label: "Посмотреть детали", onClick: () => openShipModal(resp) },
      ],
    };
  }

  async function loadShipReviews(shipId) {
    if (!shipId) return;
    setShipReviewsLoading(true);
    try {
      const res = await apiFetch(`${SHIP_REVIEWS_ENDPOINT}/${shipId}`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setShipReviews(Array.isArray(data) ? data : []);
      } 
      else {
        setShipReviews([]);
      }
    } 
    catch {
      setShipReviews([]);
    } 
    finally {
      setShipReviewsLoading(false);
    }
  }

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
        setPolling(false);
        // loadActiveOrder?.();
      } 
      else {
        const txt = await res.text().catch(() => "");
        console.error(
          "Ошибка подтверждения. Статус:",
          res.status,
          txt || ""
        );
      }
    } 
    catch (err) {
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
      } 
      catch (err) {
        console.error("Ошибка при опросе откликов:", err);
      } 
      finally {
        if (!cancelledFlag) setLoading(false);
      }
    }

    fetchResponses();
    intervalId = setInterval(fetchResponses, POLL_INTERVAL);

    return () => {
      cancelledFlag = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [polling]);

  if (loading && responses.length === 0) {
    return (
      <div className={styles["page"]}>
        <Container className={styles["loading-container"]}>
          <Spinner animation="border" size="sm" />
          <span>Загрузка откликов...</span>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles["page"]}>

      <header className={styles["header"]}>
        <div className={styles["inner"]}>
          <Button 
            variant="light" 
            onClick={() => navigate("/")}
            className={styles["home-icon-button"]} 
            aria-label="Домашняя страница"
          >
            <ArrowLeft className={styles["home-icon"]}/>
          </Button>

          <h1 className={styles["title"]}>Результаты откликов</h1>

          <Button 
            variant="light" 
            onClick={() => navigate("/user")}
            className={styles["user-icon-button"]}
            aria-label="Профиль"
          >
            <UserIcon className={styles["user-icon"]} />
          </Button>
        </div>
      </header>

      <Container className={styles["container"]}>
        <div className={styles["header-block"]}>

          <div className={["actions-header"]}>
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
            className={styles["alert"]}
            role="alert"
          >
            {cancelError}
          </div>
        )}

          <section className={styles["results-section"]}>

            <div className={styles["results-header"]}>
              <h2 className={styles["results-title"]}>Отклики</h2>

              {cancelled ? (
                <button
                  className={styles["cancel-button"]}
                >
                  Заявка отменена
                </button>  
              ) : (
                <button
                  className={styles["cancel-button"]}
                  onClick={handleCancelOrder}
                  disabled={!rentOrderId || canceling}
                  title={
                    rentOrderId
                      ? "Отменить текущую заявку"
                      : "Идентификатор заявки не найден"
                  }
                >
                  {canceling ? "Отмена..." : "Отменить заявку"}
                </button>
              )}
            </div>

            {loading && responses.length === 0 ? (
              <div className={styles["loadingContainer"]}>
                <Spinner animation="border" size="sm" />
                <span>Загрузка откликов...</span>
              </div>
            ) : responses.length === 0 ? (
              <div className={styles["results-empty"]}>
                Пока нет откликов от партнёров.
              </div>
            ) : (
              <div className={styles["results-card-list"]}>
                {responses.map((resp) => {
                  const card = mapOfferToTripCard(resp);
                  return (
                    <ShipCard
                      key={resp.id}
                      {...card}
                      isPartner={false}
                      onAction={(action) => {
                        const key = typeof action === "string" ? action : action?.key;
                        if (key === "details") {
                          openShipModal(resp);
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
        </section>
        <ShipDetails
          show={showShipModal}
          ship={selectedShip}
          shipReviews={shipReviews}
          shipReviewsLoading={shipReviewsLoading}
          onClose={closeShipModal}
          onApprove={handleApproveInModal}
          onReject={handleRejectInModal}
          busy={decisionLoading}
        />
      </Container>
    </div>
  );
}
