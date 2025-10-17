import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Filter } from "lucide-react";
import TicketCard from "./SupportTicket";
import styles from "./SupportAppeals.module.css";

function ShipIcon() {
  return (
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
}

export default function TicketList({ DetailsComponent, detailsSide = "left" }) {
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
        isActive: true
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
        icon: <ShipIcon />
      },
      {
        id: "T-003",
        title: "Вопрос о возврате средств",
        description: "Нужно вернуть деньги за отмененную поездку",
        author: "Михаил Сидоров",
        timestamp: "2024-01-16 08:30",
        assignee: "Ольга В.",
        priority: "low",
        status: "resolved"
      }
    ],
    []
  );

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return tickets;
    return tickets.filter((t) =>
      [t.id, t.title, t.description, t.author, t.assignee, t.status, t.priority]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query, tickets]);

  const handleSelect = useCallback((ticket) => {
    setSelected(ticket);
    setDetailsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDetailsOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setDetailsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const leftFirst = detailsSide === "left";

  return (
    <div className={styles["ticket-page"]}>
      <div className={styles["layout"]}>
        {leftFirst && (
          <aside
            className={`${styles["details-panel"]} ${detailsOpen ? styles["open"] : ""}`}
            aria-hidden={!detailsOpen}
          >
            {DetailsComponent && selected ? (
              <DetailsComponent ticket={selected} onClose={handleClose} />
            ) : null}
          </aside>
        )}

        <section className={styles["list-panel"]}>
          <h2 className={styles["title"]}>Список обращений</h2>
          <div className={styles["search-row"]}>
            <div className={styles["search"]}>
              <Search className={styles["search-icon"]} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск обращений..."
                className={styles["search-input"]}
              />
            </div>
            <button type="button" className={styles["filter-btn"]}>
              <Filter className={styles["filter-icon"]} size={16} />
              <span>Фильтры</span>
            </button>
          </div>
          <div className={styles["list"]}>
            {filtered.map((t) => (
              <button
                key={t.id}
                className={`${styles["list-item"]} ${selected?.id === t.id ? styles["active"] : ""}`}
                onClick={() => handleSelect(t)}
              >
                <TicketCard {...t} isActive={selected?.id === t.id || t.isActive} />
              </button>
            ))}
          </div>
        </section>

        {!leftFirst && (
          <aside
            className={`${styles["details-panel"]} ${detailsOpen ? styles["open"] : ""}`}
            aria-hidden={!detailsOpen}
          >
            {DetailsComponent && selected ? (
              <DetailsComponent ticket={selected} onClose={handleClose} />
            ) : null}
          </aside>
        )}
      </div>

      <div
        className={`${styles["overlay"]} ${detailsOpen ? styles["overlay-open"] : ""}`}
        onClick={handleClose}
      />
    </div>
  );
}
