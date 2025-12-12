import { Modal, Button, Spinner } from "react-bootstrap";

import ShipReviews from "../user/ships/ShipReviews.jsx";

import styles from "./ShipDetails.module.css";

export default function ShipDetails({ 
  show, 
  ship, 
  shipReviews = [],
  shipReviewsLoading = false,
  onClose, 
  onApprove, 
  onReject, 
  busy = false 
}) {
  const img =
    ship?.primaryImageMimeType && ship?.primaryImageUrl
      ? `data:${ship.primaryImageMimeType};base64,${ship.primaryImageUrl}`
      : ship?.primaryImageUrl || "";

  function formatYear(value, { full = false } = {}) {
    if (!value) return "—";

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    if (full) {
      return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    return String(d.getFullYear());
  }

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Детали судна</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!ship ? (
          <div className={styles["loading"]}>
            <Spinner animation="border" size="sm" />
            <span>Загрузка...</span>
          </div>
        ) : (
          <div className={styles["ship-modal-body"]}>
            {img && (
              <img
                src={img}
                alt={ship?.name || "Судно"}
                className={styles["image"]}
              />
            )}
            <div className={styles["info"]}>
              <div className={styles["name"]}>
                {ship?.name || "Без названия"}
              </div>
              <div className={styles["type"]}>
                Тип: {ship?.shipTypeName || "—"}
              </div>
              <div className={styles["capacity"]}>
                Вместимость: До {ship?.capacity ?? "—"} человек
              </div>
              <div className={styles["speed"]}>
                Максимальная скорость: {ship?.maxSpeed ?? "—"} узлов
              </div>
              <div className={styles["year"]}>
                Год производства: {formatYear(ship?.yearOfManufacture)}
              </div>
              {ship?.description && ship.description.trim() && (
                <div className={styles["description"]}>
                  Описание: {ship.description}
                </div>
              )}
              <ShipReviews shipReviews={shipReviews} shipReviewsLoading={shipReviewsLoading} />
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className={styles["footer"]}>
        <div className={styles["group"]}>
          <Button 
            variant="primary" 
            onClick={onApprove} 
            disabled={busy}>
            {busy ? "Принимаем..." : "Принять заявку"}
          </Button>
          <Button 
            variant="danger" 
            onClick={onReject} 
            disabled={busy}>
            {busy ? "Отклоняем..." : "Отклонить заявку"}
          </Button>
        </div>
        <div className={styles["group"]}>
          <Button 
            variant="secondary" 
            onClick={onClose} 
            disabled={busy}>
            Закрыть
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}