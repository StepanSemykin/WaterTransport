import { useEffect, useState } from "react";

import { Modal, Form, Button } from "react-bootstrap";

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

  return (
    <Modal show={show} onHide={onClose} size="lg" centered contentClassName={styles["trip-modal"]}>
      <Modal.Header closeButton>
        <Modal.Title>{trip?.title?.text ?? "Детали поездки"}</Modal.Title>
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
              {trip?.status && <span className={styles["trip-summary-status"]}>{trip.status}</span>}
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

          {!isPartner && (                               
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

          {isPartner && (
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
                {saving ? "Сохранение..." : "Сохранить"}
              </Button>
            </Form>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
