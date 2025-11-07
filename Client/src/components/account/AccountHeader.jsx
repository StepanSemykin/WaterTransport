import { useNavigate } from "react-router-dom";

import { Button, Container } from "react-bootstrap";
import { Bell, LogOut as LogOutIcon, Home } from "lucide-react";

import LogOut from "../auth/LogOut.jsx";

import styles from "./AccountHeader.module.css"

export function AccountHeader({ firstName, lastName, email, location }) {
  const navigate = useNavigate();

  return (
    <div className={styles["user-header"]}>
      <Container className={styles["user-topbar"]}>
        <div className={styles["user-profile"]}>
          {firstName && lastName (
            <div className={styles["user-avatar"]}>
            <span className={styles["user-avatar-text"]}>{`${firstName[0]}${lastName[0]}`}</span>
          </div>
          )}
          <div>
            <h1 className={styles["user-name"]}>{`${firstName} ${lastName}`}</h1>
            <p className={styles["user-email"]}>{email}</p>
            <p className={styles["user-registered"]}>{location}</p>
          </div>
        </div>

        <div className={styles["user-actions"]}>
          <Button variant="light" className={styles["user-icon-button"]}>
            <Bell className={styles["user-icon"]} />
          </Button>
          <Button 
            variant="light" 
            onClick={() => navigate("/")}
            className={styles["user-icon-button"]}
          >
            <Home className={styles["user-icon"]} />
          </Button>

          <LogOut
            variant="light"
            className={styles["user-icon-button"]}
            ariaLabel="Выход из аккаунта"
            icon={<LogOutIcon className={styles["user-icon"]} />}
          />
          
          {/* <Button variant="light" className={styles["user-icon-button"]}>
            <LogOutIcon className={styles["user-icon"]} />
            <LogOut />
          </Button> */}
        </div>
      </Container>
    </div>
  );
}
