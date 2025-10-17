import React, { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import SupportTicketCard from "./SupportTicket";
import styles from "./SupportAppeals.module.css";

const ShipIcon = () => (
  <svg
    className={styles["ship-icon"]}
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.16675 5.7645V7.67" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.16675 1.67V3.17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.66675 7.17V4.17C9.66675 3.90478 9.56139 3.65043 9.37385 3.46289C9.18632 3.27535 8.93196 3.17 8.66675 3.17H3.66675C3.40153 3.17 3.14718 3.27535 2.95964 3.46289C2.7721 3.65043 2.66675 3.90478 2.66675 4.17V7.17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.85678 10.67C10.3946 9.76229 10.6747 8.72506 10.6668 7.67L6.57278 5.8505C6.44496 5.79371 6.30665 5.76437 6.16678 5.76437C6.02692 5.76437 5.88861 5.79371 5.76078 5.8505L1.66678 7.67C1.64364 9.09184 2.14364 10.4726 3.07178 11.55" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.16675 11.17C1.46675 11.42 1.76675 11.67 2.41675 11.67C3.66675 11.67 3.66675 10.67 4.91675 10.67C5.56675 10.67 5.86675 10.92 6.16675 11.17C6.46675 11.42 6.76675 11.67 7.41675 11.67C8.66675 11.67 8.66675 10.67 9.91675 10.67C10.5667 10.67 10.8667 10.92 11.1667 11.17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
        icon: <ShipIcon />,
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

  const selected = useMemo(() => filtered.find(t => t.id === selectedId) || tickets.find(t => t.id === selectedId) || null, [filtered, tickets, selectedId]);

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
                className={styles["card-wrap"]}
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
                  isActive={selectedId === t.id || t.isActive}
                  icon={t.icon}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles["right"]}>
          {selected ? (
            <div className={styles["details"]}>
              <div className={styles["details-head"]}>
                <div className={styles["details-id"]}>{selected.id}</div>
                <div className={styles["details-status"]}>{selected.status}</div>
              </div>
              <div className={styles["details-title"]}>{selected.title}</div>
              <div className={styles["details-desc"]}>{selected.description}</div>
              <div className={styles["details-grid"]}>
                <div className={styles["info-item"]}>
                  <div className={styles["info-label"]}>Автор</div>
                  <div className={styles["info-value"]}>{selected.author}</div>
                </div>
                <div className={styles["info-item"]}>
                  <div className={styles["info-label"]}>Исполнитель</div>
                  <div className={styles["info-value"]}>{selected.assignee}</div>
                </div>
                <div className={styles["info-item"]}>
                  <div className={styles["info-label"]}>Приоритет</div>
                  <div className={styles["info-value"]}>{selected.priority}</div>
                </div>
                <div className={styles["info-item"]}>
                  <div className={styles["info-label"]}>Время</div>
                  <div className={styles["info-value"]}>{selected.timestamp}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles["details-empty"]}>Выберите обращение, чтобы посмотреть детали</div>
          )}
        </div>
      </div>
    </div>
  );
}
