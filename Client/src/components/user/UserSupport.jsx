import { useState } from "react";

import Accordion from "react-bootstrap/Accordion";

import styles from "./UserSupport.module.css";

const ITEMS = [
  { key: "support", label: "Чат с поддержкой", content: "Чат с поддержкой" },
  { key: "transporter", label: "Чат с перевозчиком", content: "Чат с перевозчиком" },
  { key: "problem", label: "Сообщить о проблеме", content: "Сообщить о проблеме" },
];

export default function UserSupport() {
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