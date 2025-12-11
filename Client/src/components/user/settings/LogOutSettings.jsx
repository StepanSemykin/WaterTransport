import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Modal } from "react-bootstrap";

import { useAuth } from "../../auth/AuthContext";

import LogOutModal from "../../auth/LogOutModal.jsx";

export default function LogoutSettings() {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
      navigate("/", { replace: true });
    } 
    catch (err) {
      console.error("Logout error:", err);
      alert("Не удалось выйти из аккаунта");
    } 
    finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <div>
      <h4>Выход из аккаунта</h4>
      <p>После выхода вам потребуется снова войти в систему для доступа к личному кабинету.</p>

      <Button variant="primary" onClick={() => setShowConfirm(true)} disabled={loading}>
        Выйти из аккаунта
      </Button>

      <LogOutModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        loading={loading}
      />

      {/* <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подтвердите действие</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите выйти из аккаунта?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)} disabled={loading}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleLogout} disabled={loading}>
            {loading ? "Выход..." : "Выйти"}
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
}