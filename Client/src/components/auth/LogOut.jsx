import { useState, useCallback } from "react";

import { Button, Modal, Container } from "react-bootstrap";
import { LogOut as LogOutIcon, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import styles from "./LogOut.module.css";

export default function LogOut() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const open = useCallback(() => setShow(true), []);
  const close = useCallback(() => !loading && setShow(false), [loading]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        window.location.href = "/auth";
      } 
      else {
        const txt = await res.text();
        alert("Ошибка выхода: " + txt);
      }
    } 
    catch (e) {
      alert("Ошибка сети: " + e.message);
    } 
    finally {
      setLoading(false);
      setShow(false);
    }
  };

  return (
    <>
      <Button
        variant="light"
        className={styles.iconButton}
        onClick={open}
        aria-label="Выход из аккаунта"
      >
        <LogOutIcon className={styles.icon} />
      </Button>

      <Modal
        show={show}
        onHide={close}
        centered
        backdrop="static"
        keyboard={!loading}
      >
        <Modal.Header closeButton>
          <Modal.Title className={styles.titleRow}>
            <AlertTriangle className={styles.warnIcon} />
            Подтверждение выхода
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className={styles.leadText}>
            Вы действительно хотите выйти из аккаунта?
          </p>

          <div className={styles.hintRow}>
            <CheckCircle2 className={styles.okIcon} />
            <span>Вы всегда сможете войти снова со своими данными.</span>
          </div>
          <div className={styles.hintRow}>
            <XCircle className={styles.xIcon} />
            <span>Текущая сессия будет завершена.</span>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={close}
            className={styles.cancelButton}
            disabled={loading}
          >
            Отмена
          </Button>
          <Button
            // variant="danger"
            onClick={handleLogout}
            className={styles.logoutButton}
            disabled={loading}
          >
            {loading ? "Выходим…" : "Выйти"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
