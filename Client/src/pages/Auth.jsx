import { useState } from "react";

import { Modal } from "react-bootstrap";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { User, Mail, Phone, Lock, LogIn } from "lucide-react";

import { apiFetch } from "../api/api.js";

import styles from "./Auth.module.css";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PHONE_LENGTH = 20;

export default function Auth () {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    passwordConfirm: ""
  });

  const [validation, setValidation] = useState({
    phone: "",
    password: "",
  });

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerSuggestion, setRegisterSuggestion] = useState(false);

  const passwordsMatch = formData.password === formData.passwordConfirm;

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value
  //   });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "phone") {

      if (value === "") {
        setValidation((v) => ({ ...v, phone: "" }));
        return;
      }
      else if (!/^[\d\s]*$/.test(value)) {
        setValidation((v) => ({ ...v, phone: "В номере телефона допустимы только цифры" }));
      } 
      else if (value.length > MAX_PHONE_LENGTH) {
        setValidation((v) => ({ ...v, phone: `Номер телефона не может содержать больше ${MAX_PHONE_LENGTH} цифр` }));
      } 
      else {
        setValidation((v) => ({ ...v, phone: "" }));
      }
    }

    if (name === "password") {
      if (value === "") {
        setValidation((v) => ({ ...v, password: "" }));
      }
      else if (value.length < MIN_PASSWORD_LENGTH) {
        setValidation((v) => ({ ...v, password: `Пароль должен содержать минимум ${MIN_PASSWORD_LENGTH} символов` }));
      } 
      else {
        setValidation((v) => ({ ...v, password: "" }));
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setRegisterSuggestion(false);
    setLoading(true);

    try {
      const res = await apiFetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify({
          phone: formData.phone,
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
    }
    else if (res.status === 401) {
      setError("Неверный номер телефона или пароль");
    } 
    else if (res.status === 403) {
      setError("Аккаунт не активирован")
    }
    else if (res.status === 404) {
      setRegisterSuggestion(true);
      setShowRegisterModal(true);
    }
    else if (res.status === 423) {
      setError("Аккаунт временно заблокирован")
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
    setLoading(true);

    try {
      const res = await apiFetch("/api/users/register", {
        method: "POST",
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (res.ok) {
        // const data = await res.json();
        setActiveTab("login");
        setError("Регистрация успешна. Войдите, пожалуйста");
      } 
      else if (res.status === 400) {
        // const txt = await res.text();
        setError("Аккаунт с таким номером телефона уже есть");
      }
      else {
        setError("Неизвестаная ошибка регистрации");
      }
    } 
    catch (err) {
      setError("Ошибка сети: " + err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["auth-page"]}>

      <Container>
          <div className={styles["header"]}>
            <h1 className={styles["header-title"]}>AquaRent</h1>
            <p className={styles["header-subtitle"]}>Аренда водного транспорта</p>
          </div>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className={styles["auth-card"]}>
              <Card.Body className={styles["auth-card-body"]}>

                <div className={styles["auth-tabs"]}>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("login"); setError(""); setRegisterSuggestion(false); }}
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
                      onClick={() => { setActiveTab("register"); setError(""); setRegisterSuggestion(false); }}
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
                          type="password"
                          className={styles["form-field-input"]}
                          placeholder="Введите пароль"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        {/* {validation.password && (
                          <div className={styles["auth-error"]}>{validation.password}</div>
                        )} */}
                      </div>
                    </div>
                    {validation.password && (
                      <div className={styles["auth-error"]}>{validation.password}</div>
                    )}

                    {/* <button type="submit" className={styles["auth-submit-button"]} disabled={loading}>
                      <LogIn size={20} />
                      {loading ? "Входим..." : "Войти"}
                    </button> */}
                    <button
                      type="submit"
                      className={styles["auth-submit-button"]}
                      disabled={
                        loading ||
                        validation.phone !== "" ||
                        validation.password !== "" ||
                        !formData.phone ||
                        !formData.password
                      }
                    >
                      <LogIn size={20} />
                      {loading ? "Входим..." : "Войти"}
                    </button>
                  </form>
                )}

                {activeTab === "register" && (
                  <form onSubmit={handleRegister} className={styles["auth-form"]}>
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

                    <div className={styles["form-field"]}>
                      <label className={styles["form-field-label"]} htmlFor="password">
                        Пароль
                      </label>
                      <div className={styles["form-input-wrapper"]}>
                        <Lock className={styles["form-input-icon"]} />
                        <input
                          id="password"
                          name="password"
                          type="password"
                          className={styles["form-field-input"]}
                          placeholder="Введите пароль"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles["form-field"]}>
                      <label className={styles["form-field-label"]} htmlFor="password">
                        Подтверждение пароля
                      </label>
                      <div className={styles["form-input-wrapper"]}>
                        <Lock className={styles["form-input-icon"]} />
                        <input
                          id="password-confirm"
                          name="passwordConfirm"
                          type="password"
                          className={styles["form-field-input"]}
                          placeholder="Подтвердите пароль"
                          value={formData.passwordConfirm}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className={styles["auth-submit-button"]} disabled={loading || !passwordsMatch}>
                      {loading ? "Регистрация..." : "Зарегистрироваться"}
                    </button>
                    {!passwordsMatch && <div className={styles["auth-error"]}>Пароли не совпадают</div>}
                  </form>
                )}
{/* 
                {registerSuggestion && activeTab === "login" && (
                  <div className={styles["register-suggestion"]}>
                    <p>Пользователь не найден. Хотите зарегистрироваться?</p>
                    <button
                      type="button"
                      className={styles["auth-suggest-button"]}
                      onClick={() => { setActiveTab("register"); setRegisterSuggestion(false); }}
                    >
                      Зарегистрироваться
                    </button>
                  </div>
                )} */}


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
};