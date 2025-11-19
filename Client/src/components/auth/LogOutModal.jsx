import { Modal, Button } from "react-bootstrap";

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import styles from "./LogOutModal.module.css";

export default function LogOutModal({ show, onClose, onConfirm, loading }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={!loading}
    >
      <Modal.Header closeButton>
        <Modal.Title className={styles["title-row"]}>
          <AlertTriangle className={styles["warn-icon"]} />
          Подтверждение выхода
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className={styles["lead-text"]}>
          Вы действительно хотите выйти из аккаунта?
        </p>

        <div className={styles["hint-row"]}>
          <CheckCircle2 className={styles["ok-icon"]} />
          <span>Вы всегда сможете войти снова со своими данными.</span>
        </div>
        <div className={styles["hint-row"]}>
          <XCircle className={styles["x-icon"]} />
          <span>Текущая сессия будет завершена.</span>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          className={styles["cancel-button"]}
          disabled={loading}
        >
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          className={styles["logout-button"]}
          disabled={loading}
        >
          {loading ? "Выходим…" : "Выйти"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}