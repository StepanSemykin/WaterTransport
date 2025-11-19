import { useEffect, useState } from "react";

import { Form, Button, Alert, Spinner } from "react-bootstrap";

import { useAuth } from "../../auth/AuthContext";
import { apiFetch } from "../../../api/api.js";

import styles from "./AccountSettings.module.css";

export default function AccountSettings() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    nickname: "",
    firstName: "",
    lastName: "",
    patronymic: "",
    email: "",
    birthday: "",
    about: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({
      nickname: user.nickname ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      patronymic: user.patronymic ?? "",
      email: user.email ?? "",
      birthday: user.birthday ? String(user.birthday).slice(0, 10) : "", // yyyy-mm-dd
      about: user.about ?? "",
      location: user.location ?? "",
    //   isPublic: Boolean(user.isPublic),
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Некорректный email";
    }
    if (form.firstName.length > 100 || form.lastName.length > 100) {
      return "Имя/фамилия слишком длинные";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError("");
    setSuccess("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nickname: form.nickname || null,
        firstName: form.firstName || null,
        lastName: form.lastName || null,
        patronymic: form.patronymic || null,
        email: form.email || null,
        birthday: form.birthday || null,
        about: form.about || null,
        location: form.location || null,
        isPublic: !!form.isPublic,
      };

      const res = await apiFetch("/api/userprofiles/me", {
        method: "PUT",
        // headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess("Профиль сохранён");
        // обновляем контекст пользователя
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
      setSaving(false);
    }
  };

  return (
    <div>
      <h4>Учетная запись</h4>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2" controlId="nickname">
          <Form.Label>Никнейм</Form.Label>
          <Form.Control
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="Никнейм"
            maxLength={60}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="firstName">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Имя"
            maxLength={100}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="lastName">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Фамилия"
            maxLength={100}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="patronymic">
          <Form.Label>Отчество</Form.Label>
          <Form.Control
            name="patronymic"
            value={form.patronymic}
            onChange={handleChange}
            placeholder="Отчество"
            maxLength={100}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
            type="email"
            maxLength={254}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="birthday">
          <Form.Label>Дата рождения</Form.Label>
          <Form.Control
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            type="date"
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="location">
          <Form.Label>Населённый пункт</Form.Label>
          <Form.Control
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Город, регион"
            maxLength={200}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="about">
          <Form.Label>О себе</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="Небольшая информация о вас"
            maxLength={1000}
          />
        </Form.Group>

        {/* <Form.Group className="mb-3" controlId="isPublic">
          <Form.Check
            type="checkbox"
            label="Публичный профиль"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
          />
        </Form.Group> */}

        <div className={styles["buttons"]}>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? (
              <>
                <Spinner as="span" animation="border" size="sm" /> Сохранение...
              </>
            ) : (
              "Сохранить"
            )}
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setForm({
                nickname: user.nickname ?? "",
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                patronymic: user.patronymic ?? "",
                email: user.email ?? "",
                birthday: user.birthday ? String(user.birthday).slice(0, 10) : "",
                about: user.about ?? "",
                location: user.location ?? "",
                isPublic: Boolean(user.isPublic),
              });
              setError("");
              setSuccess("");
            }}
            disabled={saving}
            class
          >
            Отменить
          </Button>
        </div>
      </Form>
    </div>
  );
}