import { useState } from "react";

import Accordion from "react-bootstrap/Accordion";

import styles from "./UserSettings.module.css";

const ITEMS = [
  { key: "account", label: "Учетная запись", content: "Учетная запись", icon: "Home" },
  { key: "payment", label: "Оплата", content: "Оплата", icon: "Payment" },
  { key: "notifications", label: "Уведомления", content: "Уведомления", icon: "Notifications" },
];

export default function UserSettings() {
  const [active, setActive] = useState("");
  
  return (
    <div className={styles["user-section"]}>
      <Accordion
        activeKey={active}
        onSelect={(key) => setActive(key)}
        className={styles["menu"]}
      >
        {ITEMS.map((item) => (
          <Accordion.Item eventKey={item.key} key={item.key} className={styles["menu-item"]}>
            <Accordion.Header className={styles["menu-item-title"]}>{item.label}</Accordion.Header>
            <Accordion.Body className={styles["menu-item-body"]}>{item.content}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}