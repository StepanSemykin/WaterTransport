import { useState, useCallback } from "react";

import { Button } from "react-bootstrap";
import { LogOut as LogOutIcon } from "lucide-react";

import LogOutModal from "./LogOutModal.jsx";
import { apiFetch } from "../../api/api.js";

import styles from "./LogOut.module.css";

const LOG_OUT_ENDPOINT = "/api/users/logout";

export default function LogOut() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const open = useCallback(() => setShow(true), []);
  const close = useCallback(() => !loading && setShow(false), [loading]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(LOG_OUT_ENDPOINT, {
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
        variant="primary"
        className={styles["icon-button"]}
        onClick={open}
        aria-label="Выход из аккаунта"
      >
        <LogOutIcon className={styles["icon"]} />
      </Button>

      <LogOutModal
        show={show}
        onClose={close}
        onConfirm={handleLogout}
        loading={loading}
      />
    </>
  );
}
