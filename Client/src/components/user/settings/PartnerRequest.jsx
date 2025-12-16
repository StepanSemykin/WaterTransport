import { useState } from "react";

import { Button, Alert, Spinner, Modal } from "react-bootstrap";

import { useAuth } from "../../auth/AuthContext";
import { apiFetch } from "../../../api/api.js";

import styles from "./PartnerRequest.module.css";

export default function PartnerRequestContent() {
  const { user, refreshUser } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setError("");
    setSuccess("");
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    if (!loading) setShowConfirm(false);
  };

  const handleSendConfirmed = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiFetch("/api/users/become-partner", {
        method: "POST",
      });

      if (res.ok) {
        setSuccess("Запрос отправлен.");
        setMessage("");
        try {
          await refreshUser({ force: true });
        } 
        catch {}
      } 
      else {
        const txt = await res.text();
        setError(txt || `Ошибка сервера: ${res.status}`);
      }
    } 
    catch (err) {
      setError("Сетевая ошибка: " + err.message);
    } 
    finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div>
      <h4>Стать партнёром</h4>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <p>Отправьте запрос на подключение как партнёр.</p>

      <div className={styles["button-confirm"]}>
        <Button variant="primary" onClick={handleOpenConfirm} disabled={loading}>
          {loading ? (
            <>
            <Spinner as="span" animation="border" size="sm" /> Отправка...
            </>
          ) : (
            "Отправить запрос"
          )}
        </Button>
      </div>

      <Modal show={showConfirm} onHide={handleCloseConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подтвердите действие</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Вы действительно хотите отправить запрос на партнёрство?</p>
          <div className={styles["text-muted"]}>
            Контактные данные будут отправлены: {user?.email ? user.email : "email не указан"} / {user?.phone ? user.phone : "телефон не указан"}
          </div>
          {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirm} disabled={loading}>Отмена</Button>
          <Button variant="primary" onClick={handleSendConfirmed} disabled={loading}>
            {loading ? (
              <>
              <Spinner as="span" animation="border" size="sm" /> Отправка...
              </>
            ) : (
              "Подтвердить и отправить"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}