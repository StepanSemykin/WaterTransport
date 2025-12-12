import { useState } from "react";

import { Modal } from "react-bootstrap";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Phone, Lock, LogIn, Eye, EyeOff } from "lucide-react";

import { AsYouType } from "libphonenumber-js";
import isStrongPassword from "validator/lib/isStrongPassword.js";
import zxcvbn from "zxcvbn";

import { apiFetch } from "../api/api.js";

import styles from "./Auth.module.css";

const REGISTER_ENDPOINT = "/api/users/register";
const LOGIN_ENDPOINT = "/api/users/login";

const MIN_PASSWORD_LENGTH = 8;
const MIN_LOWERCASE = 1;
const MIN_UPPERCASE = 1;
const MIN_NUMBERS = 1;
const MIN_SYMBOLS = 0;
const MAX_PHONE_LENGTH = 20;

// Автовалидатор пароля через validator.js (используем только при регистрации)
const validatePassword = (value) => {
  if (!value) return ""; // required обработает пустое поле

  const ok = isStrongPassword(value, {
    minLength: MIN_PASSWORD_LENGTH,
    minLowercase: MIN_LOWERCASE,
    minUppercase: MIN_UPPERCASE, // если хочешь требовать заглавные — поставь 1
    minNumbers: MIN_NUMBERS,
    minSymbols: MIN_SYMBOLS,   // если хочешь требовать спецсимволы — поставь 1
  });

  if (!ok) {
    return `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов и содержать буквы и цифры`;
  }

  return "";
};

// Оценка силы пароля (0–4) через zxcvbn
const getPasswordStrength = (value) => {
  if (!value) return { score: 0, label: "" };
  const { score } = zxcvbn(value); // 0..4
  const labels = ["Очень слабый", "Слабый", "Средний", "Хороший", "Сильный"];
  return { score, label: labels[score] };
};

export default function Auth () {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    phone: "",       // форматированный номер для инпута
    phoneE164: "",   // чистый номер для сервера (+79991234567)
    password: "",
    passwordConfirm: ""
  });

  const [validation, setValidation] = useState({
    phone: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerSuggestion, setRegisterSuggestion] = useState(false);

  const passwordsMatch = formData.password === formData.passwordConfirm;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // === Телефон: автоформатирование + E.164 + валидация ===
    if (name === "phone") {
      const formatter = new AsYouType("RU");
      const formatted = formatter.input(value); // то, что показываем в инпуте
      const phoneNumber = formatter.getNumber(); // объект PhoneNumber или undefined

      let errorMsg = "";
      const digitsCount = formatted.replace(/\D/g, "").length;

      if (formatted.trim() === "") {
        errorMsg = ""; // пустое — без ошибки, required сам сработает
      } 
      else if (!phoneNumber || !phoneNumber.isValid()) {
        errorMsg = "Некорректный номер телефона";
      } 
      else if (digitsCount > MAX_PHONE_LENGTH) {
        errorMsg = `Номер телефона не может содержать больше ${MAX_PHONE_LENGTH} цифр`;
      }

      setFormData((prev) => ({
        ...prev,
        phone: formatted,
        phoneE164: phoneNumber && phoneNumber.isValid() ? phoneNumber.number : ""
      }));

      setValidation((v) => ({ ...v, phone: errorMsg }));
      return; // дальше не идём
    }

    // === Остальные поля ===
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      if (activeTab === "register") {
        // Валидируем только при регистрации
        const errorMsg = validatePassword(value);
        setValidation((v) => ({ ...v, password: errorMsg }));
        setPasswordStrength(getPasswordStrength(value));
      } 
      else {
        // При логине валидацию сложности пароля не делаем
        setValidation((v) => ({ ...v, password: "" }));
        setPasswordStrength({ score: 0, label: "" });
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setRegisterSuggestion(false);

    // финальная проверка номера (пароль только на непустоту)
    if (validation.phone || !formData.phoneE164) {
      setError("Некорректный номер телефона");
      return;
    }
    if (!formData.password) {
      setError("Введите пароль");
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch(LOGIN_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          phone: formData.phoneE164,   // на сервер уходит чистый номер
          password: formData.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.role === "partner"){
          window.location.href = "/partner";
        }
        else {
          window.location.href = "/";
        }
      } 
      else if (res.status === 400) {
        // можно обработать валидацию бэка
      }
      else if (res.status === 401) {
        setError("Неверный номер телефона или пароль");
      } 
      else if (res.status === 403) {
        setError("Аккаунт не активирован");
      }
      else if (res.status === 404) {
        setRegisterSuggestion(true);
        setShowRegisterModal(true);
      }
      else if (res.status === 423) {
        setError("Аккаунт временно заблокирован");
      }
      else {
        setError("Ошибка сервера: " + (await res.text()));
      }
    } 
    catch (err) {
      setError("Ошибка сети: " + err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordsMatch) {
      setError("Пароли не совпадают");
      return;
    }

    if (validation.phone || !formData.phoneE164) {
      setError("Некорректный номер телефона");
      return;
    }

    if (validation.password) {
      setError(validation.password);
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch(REGISTER_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          phone: formData.phoneE164,  // E.164
          password: formData.password,
        }),
      });

      if (res.ok) {
        setActiveTab("login");
        setError("Регистрация успешна. Войдите, пожалуйста");
      } 
      else if (res.status === 400) {
        setError(res.error);
      }
      else {
        setError("Неизвестная ошибка регистрации");
      }
    } 
    catch (err) {
      setError("Ошибка сети: " + err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  // Цвет для индикатора силы пароля (используется только при регистрации)
  const strengthColor =
    passwordStrength.score < 2
      ? "#ef4444" // красный
      : passwordStrength.score === 2
        ? "#f97316" // оранжевый
        : passwordStrength.score === 3
          ? "#22c55e" // зелёный
          : "#16a34a"; // ярко-зелёный

  return (
    <div className={styles["auth-page"]}>
      <Container>
        <div className={styles["header"]}>
          <h1 className={styles["header-title"]}>AquaRent</h1>
          <p className={styles["header-subtitle"]}>Заказы водного транспорта</p>
        </div>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className={styles["auth-card"]}>
              <Card.Body className={styles["auth-card-body"]}>

                <div className={styles["auth-tabs"]}>
                  <button
                    type="button"
                    onClick={() => { 
                      setActiveTab("login"); 
                      setError(""); 
                      setRegisterSuggestion(false); 
                      // при переходе очищаем валидацию пароля/индикатор
                      setValidation((v) => ({ ...v, password: "" }));
                      setPasswordStrength({ score: 0, label: "" });
                    }}
                    className={`${styles["auth-tab"]} ${
                      activeTab === "login"
                        ? styles["auth-tab-active"]
                        : styles["auth-tab-inactive"]
                    }`}
                  >
                    Вход
                  </button>
                  {registerSuggestion && (
                    <button
                      type="button"
                      onClick={() => { 
                        setActiveTab("register"); 
                        setError(""); 
                        setRegisterSuggestion(false); 
                      }}
                      className={`${styles["auth-tab"]} ${
                        activeTab === "register"
                          ? styles["auth-tab-active"]
                          : styles["auth-tab-inactive"]
                      }`}
                    >
                      Регистрация
                    </button>
                  )}
                </div>

                {error && <div className={styles["auth-error"]}>{error}</div>}

                {/* === ВХОД === */}
                {activeTab === "login" && (
                  <form onSubmit={handleLogin} className={styles["auth-form"]}>
                    <div className={styles["form-field"]}>
                      <label className={styles["form-field-label"]} htmlFor="phone">
                        Номер телефона
                      </label>
                      <div className={styles["form-input-wrapper"]}>
                        <Phone className={styles["form-input-icon"]} />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          className={styles["form-field-input"]}
                          placeholder="Введите номер телефона"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    {validation.phone && (
                      <div className={styles["auth-error"]}>{validation.phone}</div>
                    )}

                    <div className={styles["form-field"]}>
                      <label className={styles["form-field-label"]} htmlFor="password">
                        Пароль
                      </label>
                      <div className={styles["form-input-wrapper"]}>
                        <Lock className={styles["form-input-icon"]} />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className={styles["form-field-input"]}
                          placeholder="Введите пароль"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={styles["password-toggle"]}
                          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* При логине индикатор силы и ошибки сложности не показываем */}
                    {/* validation.password всегда "" в режиме login */}

                    <button
                      type="submit"
                      className={styles["auth-submit-button"]}
                      disabled={
                        loading ||
                        validation.phone !== "" ||
                        !formData.phoneE164 ||
                        !formData.password
                      }
                    >
                      <LogIn size={20} />
                      {loading ? "Входим..." : "Войти"}
                    </button>
                  </form>
                )}

                {/* === РЕГИСТРАЦИЯ === */}
                {activeTab === "register" && (
                  <form onSubmit={handleRegister} className={styles["auth-form"]}>
                    <div className={styles["form-field"]}>
                      <label className={styles["form-field-label"]} htmlFor="phone-register">
                        Номер телефона
                      </label>
                      <div className={styles["form-input-wrapper"]}>
                        <Phone className={styles["form-input-icon"]} />
                        <input
                          id="phone-register"
                          name="phone"
                          type="tel"
                          className={styles["form-field-input"]}
                          placeholder="Введите номер телефона"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    {validation.phone && (
                      <div className={styles["auth-error"]}>{validation.phone}</div>
                    )}

                    <div className={styles["form-field"]}>
                      <label className={styles["form-field-label"]} htmlFor="password-register">
                        Пароль
                      </label>
                      <div className={styles["form-input-wrapper"]}>
                        <Lock className={styles["form-input-icon"]} />
                        <input
                          id="password-register"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className={styles["form-field-input"]}
                          placeholder="Введите пароль"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={styles["password-toggle"]}
                          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>

                      {formData.password && (
                        <div style={{ marginTop: "4px" }}>
                          <div
                            style={{
                              height: "4px",
                              borderRadius: "999px",
                              background: "#e5e7eb",
                              overflow: "hidden",
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
                    </div>

                    {validation.password && (
                      <div className={styles["auth-error"]}>{validation.password}</div>
                    )}

                    <div className={styles["form-field"]}>
                      <label className={styles["form-field-label"]} htmlFor="password-confirm">
                        Подтверждение пароля
                      </label>
                      <div className={styles["form-input-wrapper"]}>
                        <Lock className={styles["form-input-icon"]} />
                        <input
                          id="password-confirm"
                          name="passwordConfirm"
                          type={showPasswordConfirm ? "text" : "password"}
                          className={styles["form-field-input"]}
                          placeholder="Подтвердите пароль"
                          value={formData.passwordConfirm}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                          className={styles["password-toggle"]}
                          aria-label={showPasswordConfirm ? "Скрыть пароль" : "Показать пароль"}
                        >
                          {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className={styles["auth-submit-button"]} 
                      disabled={
                        loading || 
                        validation.phone !== "" ||
                        validation.password !== "" ||
                        !passwordsMatch
                      }
                    >
                      {loading ? "Регистрация..." : "Зарегистрироваться"}
                    </button>
                    {!passwordsMatch && (
                      <div className={styles["auth-error"]}>Пароли не совпадают</div>
                    )}
                  </form>
                )}

                <Modal
                  show={showRegisterModal}
                  onHide={() => setShowRegisterModal(false)}
                  centered
                  backdrop="static"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Аккаунт не найден</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>Похоже, вы ещё не зарегистрированы. Хотите создать аккаунт?</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>
                      Отмена
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setActiveTab("register");
                        setShowRegisterModal(false);
                      }}
                    >
                      Зарегистрироваться
                    </Button>
                  </Modal.Footer>
                </Modal>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
