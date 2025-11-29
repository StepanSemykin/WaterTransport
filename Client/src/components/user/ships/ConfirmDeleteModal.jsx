import { Modal, Button } from "react-bootstrap";
import { AlertTriangle } from "lucide-react";

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, shipName, isDeleting }) {
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <AlertTriangle size={24} className="text-danger" />
          Подтверждение удаления
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-3">
          Вы уверены, что хотите удалить судно <strong>"{shipName}"</strong>?
        </p>
        <div className="alert alert-warning mb-0">
          <strong>Внимание!</strong> Это действие нельзя отменить. Все данные о судне будут безвозвратно удалены.
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={isDeleting}
        >
          Отмена
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? "Удаление..." : "Удалить"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}