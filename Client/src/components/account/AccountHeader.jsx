import { Button, Container } from "react-bootstrap";
import { Bell, MessageSquare } from "lucide-react";

import styles from "./AccountHeader.module.css"

export function AccountHeader({ firstName, lastName, email, registred }) {
  return (
      <div className={styles["user-header"]}>
            <Container className={styles["user-topbar"]}>
                <div className={styles["user-profile"]}>
                    <div className={styles["user-avatar"]}>
                        <span className={styles["user-avatar-text"]}>{`${firstName[0]}${lastName[0]}`}</span>
                    </div>
                    <div>
                        <h1 className={styles["user-name"]}>{`${firstName} ${lastName}`}</h1>
                        <p className={styles["user-email"]}>{email}</p>
                        <p className={styles["user-registered"]}>{registred}</p>
                    </div>
                </div>

                <div className={styles["user-actions"]}>
                    <Button variant="light" className={styles["user-icon-btn"]}>
                    <Bell className={styles["user-icon"]} />
                    </Button>
                    <Button variant="light" className={styles["user-icon-btn"]}>
                    <MessageSquare className={styles["user-icon"]} />
                    </Button>
                </div>
            </Container>
      </div>
  );
}
