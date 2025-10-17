import { Send, Paperclip } from "lucide-react";
import StatusBadge from "./SupportStatus";
import MessageThread from "./SupportMessage";
import styles from "./SupportDetails.module.css";

export default function TicketDetails() {
  const messages = [
    {
      id: "1",
      author: "Анна Петрова",
      timestamp: "2024-01-16 10:30",
      content: `Здравствуйте! Пытаюсь оплатить бронирование яхты на завтра, но карта не проходит. Пишет "Ошибка платежа". Что делать?`,
      isSupport: false
    },
    {
      id: "2",
      author: "Мария К.",
      timestamp: "2024-01-16 10:35",
      content: `Здравствуйте, Анна! Спасибо за обращение. Проверим вашу транзакцию. Можете попробовать другую карту или способ оплаты?`,
      isSupport: true
    },
    {
      id: "3",
      author: "Анна Петрова",
      timestamp: "2024-01-16 11:15",
      content: `Попробовала другую карту - тот же результат. Очень нужно забронировать на завтра!`,
      isSupport: false
    }
  ];

  return (
    <div className={styles["details-page"]}>
      <h2 className={styles["page-title"]}>Детали обращения</h2>

      <div className={styles["section"]}>
        <div className={styles["header"]}>
          <div>
            <h3 className={styles["ticket-title"]}>Проблема с оплатой бронирования</h3>
            <p className={styles["ticket-sub"]}>T-001 • Анна Петрова</p>
          </div>
          <div className={styles["badges"]}>
            <StatusBadge type="priority" variant="high">Высокий</StatusBadge>
            <StatusBadge type="status" variant="open">Открыт</StatusBadge>
          </div>
        </div>

        <div className={styles["info-grid"]}>
          <div>
            <p className={styles["label"]}>Создано:</p>
            <p className={styles["value"]}>2024-01-16 10:30</p>
          </div>
          <div>
            <p className={styles["label"]}>Обновлено:</p>
            <p className={styles["value"]}>2024-01-16 11:15</p>
          </div>
          <div>
            <p className={styles["label"]}>Категория:</p>
            <p className={styles["value"]}>Платежи</p>
          </div>
          <div>
            <p className={styles["label"]}>Исполнитель:</p>
            <p className={styles["value"]}>Мария К.</p>
          </div>
        </div>
      </div>

      <div className={styles["section"]}>
        <h3 className={styles["thread-title"]}>Переписка</h3>

        <MessageThread messages={messages} />

        <div className={styles["composer"]}>
          <textarea
            placeholder="Введите ответ..."
            className={styles["textarea"]}
          />
          <div className={styles["actions"]}>
            <button className={styles["btn-primary"]}>
              <Send className={styles["btn-icon"]} />
              <span>Отправить</span>
            </button>

            <button className={styles["btn-secondary"]}>
              <Paperclip className={styles["btn-icon"]} />
              <span>Прикрепить</span>
            </button>

            <div className={styles["spacer"]} />

            <button className={styles["btn-ghost"]}>Решено</button>
          </div>
        </div>
      </div>
    </div>
  );
}
