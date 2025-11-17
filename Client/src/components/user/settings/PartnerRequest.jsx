import { useState } from "react";

import { Button, Form, Alert, Spinner, Modal } from "react-bootstrap";

import { useAuth } from "../../auth/AuthContext";
import { apiFetch } from "../../../api/api.js";

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
      const payload = {
        message: message || null,
        contactPhone: user?.phone || null,
        contactEmail: user?.email || null,
      };

      const res = await apiFetch("/api/users/become-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess("Запрос отправлен. Ожидайте ответа от администрации.");
        setMessage("");
        try {
          await refreshUser({ force: true });
        } catch {}
      } else {
        const txt = await res.text();
        setError(txt || `Ошибка сервера: ${res.status}`);
      }
    } catch (err) {
      setError("Сетевая ошибка: " + err.message);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div>
      <h4>Стать партнёром</h4>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <p>Отправьте запрос на подключение как партнёр. Администратор свяжется с вами для подтверждения.</p>

      <Form.Group className="mb-2" controlId="partnerMessage">
        <Form.Label>Сообщение (необязательно)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Кратко опишите, почему вы хотите стать партнёром"
          maxLength={1000}
          disabled={loading}
        />
      </Form.Group>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Button variant="primary" onClick={handleOpenConfirm} disabled={loading}>
          {loading ? (<><Spinner as="span" animation="border" size="sm" /> Отправка...</>) : "Отправить запрос"}
        </Button>
        <Button variant="outline-secondary" onClick={() => { setMessage(""); setError(""); setSuccess(""); }} disabled={loading}>
          Отмена
        </Button>
      </div>

      <Modal show={showConfirm} onHide={handleCloseConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подтвердите действие</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Вы действительно хотите отправить запрос на партнёрство?</p>
          <div style={{ fontSize: 13, color: "#555" }}>
            Контактные данные будут отправлены: {user?.email ? user.email : "email не указан"} / {user?.phone ? user.phone : "телефон не указан"}
          </div>
          {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirm} disabled={loading}>Отмена</Button>
          <Button variant="primary" onClick={handleSendConfirmed} disabled={loading}>
            {loading ? (<><Spinner as="span" animation="border" size="sm" /> Отправка...</>) : "Подтвердить и отправить"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}