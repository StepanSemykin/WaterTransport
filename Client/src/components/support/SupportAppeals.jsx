import styles from "./SupportAppeals.module.css";
import { Search, Filter, MessageSquare, Calendar, User } from "lucide-react";

export default function Appeals() {
  return (
    <div className={styles["appeals-container"]}>
      <div className={styles["appeals-header"]}>
        <div className={styles["search-container"]}>
          <div className={styles["search-input-wrapper"]}>
            <Search className={styles["search-icon"]} />
            <input 
              type="text" 
              placeholder="Поиск обращений..." 
              className={styles["search-input"]}
            />
          </div>
          <button className={styles["filter-button"]}>
            <Filter className={styles["filter-icon"]} />
            Фильтры
          </button>
        </div>
      </div>

      <div className={styles["appeals-list"]}>
        <div className={styles["appeal-item"]}>
          <div className={styles["appeal-header"]}>
            <span className={styles["appeal-id"]}>#12345</span>
            <span className={styles["appeal-status"]}>В работе</span>
          </div>
          <div className={styles["appeal-content"]}>
            <div className={styles["appeal-title"]}>
              <MessageSquare className={styles["appeal-icon"]} />
              Проблема с доступом к системе
            </div>
            <div className={styles["appeal-meta"]}>
              <div className={styles["appeal-user"]}>
                <User className={styles["meta-icon"]} />
                Иван Иванов
              </div>
              <div className={styles["appeal-date"]}>
                <Calendar className={styles["meta-icon"]} />
                15 дек 2024
              </div>
            </div>
          </div>
        </div>

        <div className={styles["appeal-item"]}>
          <div className={styles["appeal-header"]}>
            <span className={styles["appeal-id"]}>#12344</span>
            <span className={styles["appeal-status-resolved"]}>Решено</span>
          </div>
          <div className={styles["appeal-content"]}>
            <div className={styles["appeal-title"]}>
              <MessageSquare className={styles["appeal-icon"]} />
              Вопрос по оплате услуг
            </div>
            <div className={styles["appeal-meta"]}>
              <div className={styles["appeal-user"]}>
                <User className={styles["meta-icon"]} />
                Мария Петрова
              </div>
              <div className={styles["appeal-date"]}>
                <Calendar className={styles["meta-icon"]} />
                14 дек 2024
              </div>
            </div>
          </div>
        </div>

        <div className={styles["appeal-item"]}>
          <div className={styles["appeal-header"]}>
            <span className={styles["appeal-id"]}>#12343</span>
            <span className={styles["appeal-status-new"]}>Новое</span>
          </div>
          <div className={styles["appeal-content"]}>
            <div className={styles["appeal-title"]}>
              <MessageSquare className={styles["appeal-icon"]} />
              Запрос на добавление функций
            </div>
            <div className={styles["appeal-meta"]}>
              <div className={styles["appeal-user"]}>
                <User className={styles["meta-icon"]} />
                Алексей Смирнов
              </div>
              <div className={styles["appeal-date"]}>
                <Calendar className={styles["meta-icon"]} />
                15 дек 2024
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}