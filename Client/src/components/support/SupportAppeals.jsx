import React, { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import SupportTicketCard from "./SupportTicket";
import SupportTicketDetails from "./SupportDetails";
import styles from "./SupportAppeals.module.css";


export default function SupportTicketList() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const tickets = useMemo(
    () => [
      {
        id: "T-001",
        title: "Проблема с оплатой бронирования",
        description: "Не могу оплатить бронирование яхты, карта не проходит",
        author: "Анна Петрова",
        timestamp: "2024-01-16 11:15",
        assignee: "Мария К.",
        priority: "high",
        status: "open",
        isActive: true,
      },
      {
        id: "T-002",
        title: "Не могу добавить новое судно",
        description: "При попытке добавить катер возникает ошибка загрузки фотографий",
        author: "Капитан Дмитрий",
        timestamp: "2024-01-16 10:20",
        assignee: "Алексей С.",
        priority: "medium",
        status: "in-progress",
      },
      {
        id: "T-003",
        title: "Вопрос о возврате средств",
        description: "Нужно вернуть деньги за отмененную поездку",
        author: "Михаил Сидоров",
        timestamp: "2024-01-16 08:30",
        assignee: "Ольга В.",
        priority: "low",
        status: "resolved",
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter(
      t =>
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
    );
  }, [query, tickets]);

  return (
    <div className={styles["page"]}>
      <div className={styles["split"]}>
        <div className={styles["left"]}>
          <h2 className={styles["title"]}>Список обращений</h2>
          <div className={styles["controls"]}>
            <div className={styles["search-wrap"]}>
              <Search className={styles["search-icon"]} />
              <input
                type="text"
                placeholder="Поиск обращений..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className={styles["search-input"]}
              />
            </div>
            <button className={styles["filter-btn"]}>
              <Filter className={styles["filter-icon"]} />
              <span className={styles["filter-text"]}>Фильтры</span>
            </button>
          </div>

          <div className={styles["list"]}>
            {filtered.map(t => (
              <div
                key={t.id}
                className={`${styles["card-wrap"]} ${selectedId === t.id ? styles["active"] : ""}`}
                onClick={() => setSelectedId(t.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") setSelectedId(t.id);
                }}
              >
                <SupportTicketCard
                  id={t.id}
                  title={t.title}
                  description={t.description}
                  author={t.author}
                  timestamp={t.timestamp}
                  assignee={t.assignee}
                  priority={t.priority}
                  status={t.status}
                  isActive={selectedId === t.id}
                  icon={t.icon}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles["right"]}>
          {selectedId ? (
            <SupportTicketDetails key={selectedId} />
          ) : (
            <div className={styles["details-empty"]}>
              Выберите обращение, чтобы посмотреть детали
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
