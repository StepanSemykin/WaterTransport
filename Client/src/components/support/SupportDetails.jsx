import { Send, Paperclip } from "lucide-react";
import StatusBadge from "./SupportStatus";
import MessageThread from "./SupportMessage";
import styles from "./SupportDetails.module.css";

export default function SupportTicketDetails() {
  const messages = [
    {
      id: "1",
      author: "Анна Петрова",
      timestamp: "2024-01-16 10:30",
      content: `Здравствуйте! Пытаюсь оплатить бронирование яхты на завтра, но карта не проходит. Пишет "Ошибка платежа". Что делать?`,
      isSupport: false,
    },
    {
      id: "2",
      author: "Мария К.",
      timestamp: "2024-01-16 10:35",
      content: `Здравствуйте, Анна! Спасибо за обращение. Проверим вашу транзакцию. Можете попробовать другую карту или способ оплаты?`,
      isSupport: true,
    },
    {
      id: "3",
      author: "Анна Петрова",
      timestamp: "2024-01-16 11:15",
      content: `Попробовала другую карту - тот же результат. Очень нужно забронировать на завтра!`,
      isSupport: false,
    },
  ];

  return (
    <div className={styles["page"]}>
      <h2 className={styles["title"]}>Детали обращения</h2>

      <div className={styles["stack"]}>
        <div className={styles["card"]}>
          <div className={styles["card-head"]}>
            <div>
              <h3 className={styles["card-title"]}>Проблема с оплатой бронирования</h3>
              <p className={styles["card-sub"]}>T-001 • Анна Петрова</p>
            </div>
            <div className={styles["badges"]}>
              <StatusBadge type="priority" variant="high">Высокий</StatusBadge>
              <StatusBadge type="status" variant="open">Открыт</StatusBadge>
            </div>
          </div>

          <div className={styles["info-grid"]}>
            <div className={styles["info-item"]}>
              <p className={styles["info-label"]}>Создано:</p>
              <p className={styles["info-value"]}>2024-01-16 10:30</p>
            </div>
            <div className={styles["info-item"]}>
              <p className={styles["info-label"]}>Обновлено:</p>
              <p className={styles["info-value"]}>2024-01-16 11:15</p>
            </div>
            <div className={styles["info-item"]}>
              <p className={styles["info-label"]}>Категория:</p>
              <p className={styles["info-value"]}>Платежи</p>
            </div>
            <div className={styles["info-item"]}>
              <p className={styles["info-label"]}>Исполнитель:</p>
              <p className={styles["info-value"]}>Мария К.</p>
            </div>
          </div>
        </div>

        <div className={styles["card"]}>
          <h3 className={styles["section-title"]}>Переписка</h3>

          <MessageThread messages={messages} />

          <div className={styles["composer"]}>
            <textarea
              placeholder="Введите ответ..."
              className={styles["textarea"]}
            />
            <div className={styles["actions"]}>
              <button className={styles["btn-primary"]}>
                <Send className={styles["icon"]} />
                <span>Отправить</span>
              </button>

              <button className={styles["btn-neutral"]}>
                <Paperclip className={styles["icon"]} />
                <span>Прикрепить</span>
              </button>

              <div className={styles["spacer"]} />

              <button className={styles["btn-neutral"]}>Решено</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
