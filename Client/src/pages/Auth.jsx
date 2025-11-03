import { useState } from "react";

import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { User, Mail, Phone, Lock, LogIn } from "lucide-react";

import styles from "./Auth.module.css";

export default function Auth () {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerSuggestion, setRegisterSuggestion] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Форма отправлена:", formData);
  // };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRegisterSuggestion(false);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password
        })
      });

      if (res.status === 200) {
        const data = await res.json();
        if (data.token) localStorage.setItem("token", data.token);
        // редирект или обновление состояния приложения
        window.location.href = "/";
      } else if (res.status === 401) {
        setError("Неверный пароль.");
      } else if (res.status === 404) {
        setError("Пользователь не найден.");
        setRegisterSuggestion(true);
      } else {
        const txt = await res.text();
        setError("Ошибка сервера: " + txt);
      }
    } catch (err) {
      setError("Ошибка сети: " + err.message);
    } finally {
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
                <form onSubmit={handleSubmit} className={styles["auth-form"]}>
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

                  <button type="submit" className={styles["auth-submit-button"]}>
                    <LogIn size={20} />
                    Войти
                  </button>
                </form>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

    </div>
  );
};