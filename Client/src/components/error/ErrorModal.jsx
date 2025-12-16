import { Modal, Button } from "react-bootstrap";

import styles from "./ErrorModal.module.css";

export default function ErrorModal({ 
  show, 
  onClose, 
  title = "Ошибка", 
  message = "", 
}) {
  return (
    <Modal show={Boolean(show)} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <div className={styles["message"]}>{message}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={onClose}
        >
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
}