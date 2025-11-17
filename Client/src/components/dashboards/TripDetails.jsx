import { useEffect, useState } from "react";

import { Modal, Form, Button, Alert } from "react-bootstrap";

import styles from "./TripDetails.module.css";

export default function TripDetails({
  trip,
  show,
  onClose,
  isPartner = false,
  onUpdateTripPrice,
  onCancelTrip
}) {
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    setPrice(trip?.price ?? "");
    if (trip?.review) {
      setReviewRating(Number(trip.review.rating ?? 5));
      setReviewComment(trip.review.comment ?? "");
      setReviewSubmitted(true);
    } else {
      setReviewRating(5);
      setReviewComment("");
      setReviewSubmitted(false);
    }
  }, [trip]);

  useEffect(() => {
    setPrice(trip?.price ?? "");
  }, [trip]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isPartner || typeof onUpdateTripPrice !== "function" || !trip) {
      onClose();
      return;
    }

    try {
      setSaving(true);
      await onUpdateTripPrice(trip, price);
      onClose();
    } 
    finally {
      setSaving(false);
    }
  }

  async function handleCancel() {                
    if (!trip) return;
    if (typeof onCancelTrip !== "function") {
      onClose();
      return;
    }

    try {
      setCancelling(true);
      await onCancelTrip(trip);
      onClose();
    } finally {
      setCancelling(false);
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
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`/api/trips/${trip.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (res.ok) {
        const data = await res.json();
        setReviewSubmitted(true);
        // опционально: обновить trip в родителе через callback, если есть
      } else {
        const txt = await res.text();
        setReviewError(txt || `Ошибка сервера: ${res.status}`);
      }
    } catch (err) {
      setReviewError("Сетевая ошибка: " + err.message);
    } finally {
      setReviewLoading(false);
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
            {/* {trip?.imageSrc && (
              <img
                src={trip.imageSrc}
                alt={trip.imageAlt ?? ""}
                className={styles["trip-summary-image"]}
              />
            )} */}
            <div className={styles["trip-summary-info"]}>
              {/* {trip?.status && <span className={styles["trip-summary-status"]}>{trip.status}</span>} */}
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
              {(trip?.details ?? []).map((detail) => (
                <div key={detail.text} className={styles["trip-summary-line"]}>
                  Дата: {detail.text}
                </div>
              ))}
              {trip?.passengers && (
                <div className={styles["trip-summary-line"]}>
                  Всего пассажиров: {trip.passengers}
                </div>
              )}
            </div>
          </div>

          {/* <div className={styles["trip-map-placeholder"]}>
            Карта маршрута будет отображена здесь
          </div> */}

          {trip.status == "upcoming" && (
          <div className={styles["trip-actions"]}>
            <Button
              variant="outline-danger"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "Отмена..." : "Отменить поездку"}
            </Button>
          </div>
          )}

          {isPartner && trip.status == "possible" && (
            <Form onSubmit={handleSubmit} className={styles["trip-price-form"]}>
              <Form.Group controlId="tripPrice" className={styles["trip-price-input"]}>
                <Form.Label>Цена поездки</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="Введите стоимость"
                />
              </Form.Group>

              <Button type="submit" variant="primary" disabled={saving || !price}>
                {saving ? "Отправка..." : "Отправить предложение"}
              </Button>
            </Form>
          )}

          {trip?.status === "completed" && (
            <div className={styles["trip-review"]}>
              <h5>Отзыв о поездке</h5>
              {reviewError && <Alert variant="danger">{reviewError}</Alert>}
              {reviewSubmitted || trip?.review ? (
                <div>
                  <div className={styles["trip-review-rating"]}>Оценка: {reviewRating} / 5</div>
                  {reviewComment && <div className={styles["trip-review-comment"]}>{reviewComment}</div>}
                  <div className={styles["trip-review-edit"]}>
                    <Button variant="outline-secondary" size="sm" onClick={() => {
                      // разрешить редактирование — снять флаг submitted
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
                    <Button type="submit" variant="primary" disabled={reviewLoading}>
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
