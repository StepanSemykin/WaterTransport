import { useEffect, useState } from "react";

import { Modal, Form, Button, Alert } from "react-bootstrap";

import { apiFetch } from "../../api/api.js";

import styles from "./TripDetails.module.css";

const OFFERS_ENDPOINT = "/api/rent-orders/Offers";
const TRIPS_ENDPOINT = "/api/trips";
const RENT_ORDERS_ENDPOINT = "/api/rentorders";

export default function TripDetails({
  trip,
  show,
  onClose,
  isPartner = false,
  isPending = false,
  isRejected = false,
  onCancelTrip
}) {
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [discontinued, setDiscontinued] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [selectedShipId, setSelectedShipId] = useState(null);

  const partnerCanSelectShip =
    isPartner &&
    Array.isArray(trip?.matchingShips) &&
    trip.matchingShips.length > 0;

  useEffect(() => {
    setPrice(trip?.price ?? "");
    if (trip?.review) {
      setReviewRating(Number(trip.review.rating ?? 5));
      setReviewComment(trip.review.comment ?? "");
      setReviewSubmitted(true);
    } 
    else {
      setReviewRating(5);
      setReviewComment("");
      setReviewSubmitted(false);
    }

    const shipId = trip?.shipId ?? trip?.ShipId;
    if (shipId) {
      setSelectedShipId(shipId);
    } 
    else if (Array.isArray(trip?.rentOrder.matchingShips) && trip.rentOrder.matchingShips.length > 0) {
      setSelectedShipId(trip.rentOrder.matchingShips[0].id);
    }   
    else {
      setSelectedShipId(null);
    }  
  }, [trip]);

  async function sendPartnerOffer(rentOrderId, offerPrice, shipId) {
    if (!rentOrderId) throw new Error("rentOrderId отсутствует");
    const res = await apiFetch(OFFERS_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        rentOrderId,
        shipId,
        offeredPrice: Number(offerPrice)
      })
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json().catch(() => ({}));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isPartner || !trip) {
      onClose();
      return;
    }

    try {
      setSaving(true);
      const rentOrderId = trip?.id ?? trip?.Id ?? trip?.rentOrderId;
      const shipId =
        selectedShipId ?? trip?.ShipId ?? trip?.shipId; 

      await sendPartnerOffer(rentOrderId, price, shipId);
      onClose();
    } 
    finally {
      setSaving(false);
    }
  }

  async function handleSubmitReview(e) {
    e && e.preventDefault();
    if (!trip) return;
    setReviewError("");
    if (reviewRating < 0 || reviewRating > 5) {
      setReviewError("Оценка должна быть от 0 до 5");
      return;
    }
    setReviewLoading(true);
    try {
      const res = await apiFetch(`${TRIPS_ENDPOINT}/${trip.id}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (res.ok) {
        const data = await res.json();
        setReviewSubmitted(true);
      } 
      else {
        const txt = await res.text();
        setReviewError(txt || `Ошибка сервера: ${res.status}`);
      }
    } 
    catch (err) {
      setReviewError("Сетевая ошибка: " + err.message);
    } 
    finally {
      setReviewLoading(false);
    }
  }

  async function handleFinishTrip() {
    if (!trip?.id) return;
    setCompleted(true);
    try {
      const res = await apiFetch(`${RENT_ORDERS_ENDPOINT}/${trip.id}/complete`, {
        method: "POST",
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Ошибка ${res.status}`);
      }
      onClose();
    } 
    catch (err) {
      console.error("finish trip failed:", err);
      alert(err.message || "Не удалось завершить поездку");
    } 
    finally {
      setCompleted(false);
    }
  }

  async function handleDiscontinue() {
    if (!trip?.id) return;
      setDiscontinued(true);
    try {
      const res = await apiFetch(`${RENT_ORDERS_ENDPOINT}/${trip.id}/discontinued`, {
        method: "POST",
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Ошибка ${res.status}`);
      }
      onCancelTrip?.(trip.id);
      onClose();
    } 
    catch (err) {
      console.error("cancel trip failed:", err);
      alert(err.message || "Не удалось отменить поездку");
    } finally {
      setDiscontinued(false);
    }
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" centered contentClassName={styles["trip-modal"]}>
      <Modal.Header closeButton>
        <Modal.Title>{"Детали поездки"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className={styles["trip-modal-body"]}>
          <div className={styles["trip-map-placeholder"]}>
            Карта маршрута будет отображена здесь
          </div>

          <div className={styles["trip-summary"]}>
            <div className={styles["trip-summary-info"]}>
              {trip?.title && (
                <div className={styles["trip-summary-line"]}>
                  Судно: {trip.title.text}
                </div>
              )}
              {trip?.captain && (
                <div className={styles["trip-summary-line"]}>
                  Капитан: {trip.captain.text}
                </div>
              )}
              {trip?.portDeparture && (
                <div className={styles["trip-summary-line"]}>
                  Пристань отправления: {trip.portDeparture.text}
                </div>
              )}
              {trip?.portArrival && (
                <div className={styles["trip-summary-line"]}>
                  Пристань прибытия: {trip.portArrival.text}
                </div>
              )}
              {(() => {
                const arr = Array.isArray(trip?.details) ? trip.details : [];
                const parts = arr
                  .map(d => (typeof d?.text === "string" ? d.text.trim() : ""))
                  .filter(Boolean);
                const dateTime = parts.join(", ");
                return dateTime ? (
                  <div className={styles["trip-summary-line"]}>
                    Дата: {dateTime}
                  </div>
                ) : null;
              })()}
              {trip?.passengers && (
                <div className={styles["trip-summary-line"]}>
                  Всего пассажиров: {trip.passengers}
                </div>
              )}
              {(() => {
                const totalPrice = trip?.totalPrice || trip?.rentOrder?.totalPrice || trip?.price;
                return totalPrice && (isPending || isRejected || trip.status == "Agreed") ? (
                  <div className={styles["trip-summary-line"]}>
                    Стоимость: {totalPrice}
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {trip.status == "Agreed" && (
            <div className={styles["trip-actions"]}>
              <Button
                type="submit"
                variant="danger"
                onClick={handleDiscontinue}
                disabled={discontinued}
              >
                {discontinued ? "Отмена..." : "Отменить поездку"}
              </Button>
              {!isPartner && (
                <Button
                  type="submit" 
                  variant="primary" 
                  onClick={handleFinishTrip}
                  disabled={completed}
                >
                  {completed ? "Завершение.." : "Завершить поездку"}
                </Button>
              )}
            </div>
          )}

          {partnerCanSelectShip && (
            <div className={styles["trip-ship-select"]}>
              <h5>Выберите судно для предложения</h5>
              <div className={styles["trip-ship-list"]}>
                {trip.matchingShips.map((ship) => (
                  <button
                    key={ship.id}
                    type="button"
                    onClick={() => setSelectedShipId(ship.id)}
                    className={`${styles["trip-ship-card"]} ${
                      selectedShipId === ship.id
                        ? styles["trip-ship-card--selected"]
                        : ""
                    }`.trim()}
                  >
                    <div className={styles["trip-ship-info"]}>
                      <div className={styles["trip-ship-name"]}>{ship.name}</div>
                      {ship.shipTypeName && (
                        <div className={styles["trip-ship-type"]}>
                          Тип: {ship.shipTypeName}
                        </div>
                      )}
                      {ship.capacity && (
                        <div className={styles["trip-ship-capacity"]}>
                          Вместимость: {ship.capacity}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isPartner && !isPending && !isRejected && (trip.status == "AwaitingResponse" || trip.status == "HasOffers") && (
            <Form onSubmit={handleSubmit} className={styles["trip-price-form"]}>
              <Form.Group controlId="tripPrice" className={styles["trip-price-input"]}>
                <Form.Label>Стоимость поездки</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="Введите стоимость"
                />
              </Form.Group>

              <Button 
                type="submit" 
                variant="primary" 
                disabled={saving || !price || !selectedShipId}>
                {saving ? "Отправка..." : "Отправить предложение"}
              </Button>
            </Form>
          )}

          {trip.status === "Completed" && !isPartner && (
            <div className={styles["trip-review"]}>
              <h5>Отзыв о поездке</h5>
              {reviewError && <Alert variant="danger">{reviewError}</Alert>}
              {reviewSubmitted || trip?.review ? (
                <div>
                  <div className={styles["trip-review-rating"]}>Оценка: {reviewRating} / 5</div>
                  {reviewComment && <div className={styles["trip-review-comment"]}>{reviewComment}</div>}
                  <div className={styles["trip-review-edit"]}>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={() => {
                        setReviewSubmitted(false);
                      }}>
                      Редактировать отзыв
                    </Button>
                  </div>
                </div>
              ) : (
                <Form onSubmit={handleSubmitReview}>
                  <Form.Group controlId="reviewRating" className="mb-2">
                    <Form.Label>Оценка (0–5)</Form.Label>
                    <Form.Range
                      min={0}
                      max={5}
                      step={0.5}
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                     />
                    <div className={styles["trip-review-rating"]}>{reviewRating} / 5</div>
                  </Form.Group>

                  <Form.Group controlId="reviewComment" className="mb-3">
                    <Form.Label>Отзыв (необязательно)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      maxLength={1000}
                    />
                  </Form.Group>

                  <div className={styles["trip-review-button"]}>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={reviewLoading}
                    >
                      {reviewLoading ? "Сохраняем..." : "Отправить отзыв"}
                    </Button>
                    <Button variant="secondary" onClick={() => { setReviewRating(5); setReviewComment(""); }} disabled={reviewLoading}>
                      Очистить
                    </Button>
                  </div>
                </Form>
              )}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
