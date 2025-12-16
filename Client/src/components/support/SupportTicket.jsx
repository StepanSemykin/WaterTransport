import { User, Clock, MoreVertical } from "lucide-react";
import StatusBadge from "./SupportStatus";
import styles from "./SupportTicket.module.css";

export default function TicketCard({
  id,
  title,
  description,
  author,
  timestamp,
  assignee,
  priority,
  status,
  isActive = false,
  icon
}) {
  const priorityText = {
    high: "Высокий",
    medium: "Средний",
    low: "Низкий"
  };

  const statusText = {
    open: "Открыт",
    "in-progress": "В работе",
    resolved: "Решен"
  };

  return (
    <div
      className={`${styles["card"]} ${isActive ? styles["active"] : ""}`}
    >
      <div className={styles["content"]}>
        <div className={styles["meta"]}>
          <span className={styles["id"]}>{id}</span>
          <StatusBadge type="priority" variant={priority}>
            {priorityText[priority]}
          </StatusBadge>
          <StatusBadge type="status" variant={status}>
            {statusText[status]}
          </StatusBadge>
        </div>

        <h3 className={styles["title"]}>{title}</h3>
        <p className={styles["description"]}>{description}</p>

        <div className={styles["info"]}>
          <div className={styles["info-item"]}>
            {icon || <User className={styles["icon-small"]} />}
            <span>{author}</span>
          </div>
          <div className={styles["info-item"]}>
            <Clock className={styles["icon-small"]} />
            <span>{timestamp}</span>
          </div>
          <span className={styles["assignee"]}>Исполнитель: {assignee}</span>
        </div>
      </div>

      <button className={styles["more-btn"]}>
        <MoreVertical className={styles["more-icon"]} />
      </button>
    </div>
  );
}
