import { useState } from "react";

import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { User, Mail, Phone, Lock, LogIn } from "lucide-react";

import styles from "./Auth.module.css";

export default function Auth () {
  const [activeTab, setActiveTab] = useState("register");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Форма отправлена:", formData);
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

                {/* <div className={styles["auth-tabs"]}>
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className={`${styles["auth-tab"]} ${activeTab === "login" ? styles["auth-tab-active"] : styles["auth-tab-inactive"]}`}
                  >
                    Вход
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className={`${styles["auth-tab"]} ${activeTab === "register" ? styles["auth-tab-active"] : styles["auth-tab-inactive"]}`}
                  >
                    Регистрация
                  </button>
                </div> */}

                <form onSubmit={handleSubmit} className={styles["auth-form"]}>
                  {/* <div className={styles["form-field"]}>
                    <label className={styles["form-field-label"]} htmlFor="fullName">
                      Полное имя
                    </label>
                    <div className={styles["form-input-wrapper"]}>
                      <User className={styles["form-input-icon"]} />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        className={styles["form-field-input"]}
                        placeholder="Введите ваше полное имя"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div> */}

                  {/* <div className={styles["form-field"]}>
                    <label className={styles["form-field-label"]} htmlFor="email">
                      Email
                    </label>
                    <div className={styles["form-input-wrapper"]}>
                      <Mail className={styles["form-input-icon"]} />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className={styles["form-field-input"]}
                        placeholder="Введите ваш email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div> */}

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