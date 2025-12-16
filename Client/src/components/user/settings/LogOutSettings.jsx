import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button} from "react-bootstrap";

import { useAuth } from "../../auth/AuthContext.jsx";
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
    </div>
  );
}