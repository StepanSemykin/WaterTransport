import { useState } from "react";

import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import isStrongPassword from "validator/lib/isStrongPassword.js";
import zxcvbn from "zxcvbn";

import { useAuth } from "../../auth/AuthContext.jsx";
import { apiFetch } from "../../../api/api";

import styles from "./ChangePassword.module.css";

const CHANGE_USER_ENDPOINT = "/api/users/change-password";

const MIN_PASSWORD_LENGTH = 8;
const MIN_LOWERCASE = 1;
const MIN_UPPERCASE = 1;
const MIN_NUMBERS = 1;
const MIN_SYMBOLS = 0;

const validatePassword = (value) => {
  if (!value) return "";
  const ok = isStrongPassword(value, {
    minLength: MIN_PASSWORD_LENGTH,
    minLowercase: MIN_LOWERCASE,
    minUppercase: MIN_UPPERCASE,
    minNumbers: MIN_NUMBERS,
    minSymbols: MIN_SYMBOLS,
  });
  if (!ok) {
    return `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов и содержать буквы и цифры`;
  }
  return "";
};

const getPasswordStrength = (value) => {
  if (!value) return { score: 0, label: "" };
  const { score } = zxcvbn(value);
  const labels = ["Очень слабый", "Слабый", "Средний", "Хороший", "Сильный"];
  return { score, label: labels[score] };
};

export default function ChangePassword() {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "" });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleNewPasswordChange = (e) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    setPasswordValidation(validatePassword(pwd));
    setPasswordStrength(getPasswordStrength(pwd));
  };

  const passwordsMatch = newPassword === confirmPassword;

  const validateForm = () => {
    if (!user?.id) {
      setErrorMessage("Ошибка: пользователь не авторизован");
      return false;
    }
    if (!oldPassword.trim()) {
      setErrorMessage("Введите текущий пароль");
      return false;
    }
    if (passwordValidation) {
      setErrorMessage(passwordValidation);
      return false;
    }
    if (!passwordsMatch) {
      setErrorMessage("Пароли не совпадают");
      return false;
    }
    if (oldPassword === newPassword) {
      setErrorMessage("Новый пароль должен отличаться от текущего");
      return false;
    }
    return true;
  };

  async function handleChangePassword(e) {
    e?.preventDefault?.();
    clearMessages();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await apiFetch(`${CHANGE_USER_ENDPOINT}/${user.id}`, {
        method: "POST",
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || `Ошибка ${res.status}: не удалось изменить пароль`
        );
      }

      setSuccessMessage("Пароль успешно изменён");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordValidation("");
      setPasswordStrength({ score: 0, label: "" });
    } 
    catch (err) {
      setErrorMessage(err?.message || "Не удалось изменить пароль");
    } 
    finally {
      setLoading(false);
    }
  }

  const strengthColor =
    passwordStrength.score < 2
      ? "#ef4444"
      : passwordStrength.score === 2
        ? "#f97316"
        : passwordStrength.score === 3
          ? "#22c55e"
          : "#16a34a";

  return (
    <div className={styles["change-password-container"]}>
      <h3 className={styles["title"]}>Изменить пароль</h3>

      {successMessage && (
        <Alert variant="success" onClose={clearMessages} dismissible>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="danger" onClose={clearMessages} dismissible>
          {errorMessage}
        </Alert>
      )}

      <Form onSubmit={handleChangePassword} className={styles["form"]}>
        <Form.Group className={styles["form-group"]}>
          <Form.Label>Текущий пароль</Form.Label>
          <InputGroup>
            <Form.Control
              type={showOldPassword ? "text" : "password"}
              placeholder="Введите текущий пароль"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={loading}
              className={styles["form-input"]}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowOldPassword(!showOldPassword)}
              disabled={loading}
              className={styles["eye-button"]}
            >
              {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className={styles["form-group"]}>
          <Form.Label>Новый пароль</Form.Label>
          <InputGroup>
            <Form.Control
              type={showNewPassword ? "text" : "password"}
              placeholder="Введите новый пароль (минимум 8 символов)"
              value={newPassword}
              onChange={handleNewPasswordChange}
              disabled={loading}
              className={styles["form-input"]}
              isInvalid={newPassword && passwordValidation !== ""}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={loading}
              className={styles["eye-button"]}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </InputGroup>

          {newPassword && (
            <div style={{ marginTop: "8px" }}>
              <div
                style={{
                  height: "4px",
                  borderRadius: "999px",
                  background: "#e5e7eb",
                  overflow: "hidden",
                  marginBottom: "4px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(passwordStrength.score + 1) * 20}%`,
                    transition: "width 0.2s ease",
                    background: strengthColor,
                  }}
                />
              </div>
              <small style={{ fontSize: "12px", color: "#6b7280" }}>
                Сложность: {passwordStrength.label || "Очень слабый"}
              </small>
            </div>
          )}

          {passwordValidation && (
            <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
              {passwordValidation}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className={styles["form-group"]}>
          <Form.Label>Подтверждение пароля</Form.Label>
          <InputGroup>
            <Form.Control
              type={showNewPassword ? "text" : "password"}
              placeholder="Повторите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className={styles["form-input"]}
              isInvalid={confirmPassword && !passwordsMatch}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={loading}
              className={styles["eye-button"]}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </InputGroup>
          {confirmPassword && !passwordsMatch && (
            <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
              Пароли не совпадают
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <div className={styles["button-group"]}>
          <Button
            type="submit"
            variant="primary"
            disabled={
              loading ||
              passwordValidation !== "" ||
              !passwordsMatch ||
              !oldPassword ||
              !newPassword
            }
            className={styles["submit-btn"]}
          >
            {loading ? "Изменение..." : "Изменить пароль"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword("");
              setPasswordValidation("");
              setPasswordStrength({ score: 0, label: "" });
              clearMessages();
            }}
            disabled={loading}
            className={styles["cancel-btn"]}
          >
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  );
}