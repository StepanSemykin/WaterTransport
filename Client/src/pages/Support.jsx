import styles from "./Support.module.css";
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  UsersRound, 
  TrendingUp, 
  Settings 
} from "lucide-react";

export default function Support() {
  return (
    <div className={styles["support-page"]}>
      <header className={styles["support-header"]}>
        <div className={styles["header-container"]}>
          <div className={styles["header-row"]}>
            <div className={styles["header-start"]}>
              <button className={styles["back-button"]}>
                <ArrowLeft className={styles["icon-sm"]} />
              </button>
              <div className={styles["header-titles"]}>
                <h1>Служба поддержки</h1>
                <p>Центр обработки обращений</p>
              </div>
            </div>
            <div className={styles["header-end"]}>
              <button className={styles["logout-button"]}>Выйти</button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles["main-container"]}>
        <div className={styles["segments-container"]}>
          <button className={`${styles["segment-button"]} ${styles["segment-button-primary"]}`}>
            Обращения
            <span className={styles["segment-badge"]}>45</span>
          </button>
          <button className={`${styles["segment-button"]} ${styles["segment-button-secondary"]}`}>
            Статистика
          </button>
        </div>

        <section className={styles["kpi-grid"]}>
          <div className={styles["kpi-column"]}>
            <StatCard
              icon={<Clock className={`${styles["stat-icon"]} ${styles["stat-icon-primary"]}`} />}
              title="Всего обращений"
              value="234"
            />
          </div>
          <div className={styles["kpi-column"]}>
            <StatCard
              icon={<AlertTriangle className={`${styles["stat-icon"]} ${styles["stat-icon-warning"]}`} />}
              title="Открытых"
              value="45"
            />
          </div>
          <div className={styles["kpi-column"]}>
            <StatCard
              icon={<CheckCircle2 className={`${styles["stat-icon"]} ${styles["stat-icon-success"]}`} />}
              title="Решено сегодня"
              value="18"
            />
          </div>
          <div className={styles["kpi-column"]}>
            <StatCard
              icon={<Clock className={`${styles["stat-icon"]} ${styles["stat-icon-info"]}`} />}
              title="Среднее время"
              value="2.5 мин"
            />
          </div>
        </section>

        <section className={styles["satisfaction-card"]}>
          <div className={styles["card-content"]}>
            <h3>Удовлетворенность клиентов</h3>
            <div className={styles["rating-container"]}>
              <Star className={styles["rating-star"]} />
              <span className={styles["rating-value"]}>4.6</span>
              <span className={styles["rating-max"]}>из 5</span>
            </div>
            <p className={styles["rating-description"]}>Основано на отзывах за последние 30 дней</p>
          </div>
        </section>

        <section className={styles["quick-actions-card"]}>
          <div className={styles["card-content"]}>
            <h3>Быстрые действия</h3>
            <div className={styles["quick-actions-grid"]}>
              <div className={styles["quick-action-column"]}>
                <QuickAction 
                  icon={<FileText className={styles["action-icon"]} />} 
                  label="Создать FAQ" 
                />
              </div>
              <div className={styles["quick-action-column"]}>
                <QuickAction 
                  icon={<UsersRound className={styles["action-icon"]} />} 
                  label="Групповая рассылка" 
                />
              </div>
              <div className={styles["quick-action-column"]}>
                <QuickAction 
                  icon={<TrendingUp className={styles["action-icon"]} />} 
                  label="Аналитика" 
                />
              </div>
              <div className={styles["quick-action-column"]}>
                <QuickAction 
                  icon={<Settings className={styles["action-icon"]} />} 
                  label="Настройки поддержки" 
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className={styles["stat-card"]}>
      <div className={styles["stat-card-body"]}>
        <div className={styles["stat-card-content"]}>
          <div className={styles["stat-card-icon"]}>{icon}</div>
          <div className={styles["stat-card-text"]}>
            <div className={styles["stat-card-title"]}>{title}</div>
            <div className={styles["stat-card-value"]}>{value}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label }) {
  return (
    <button className={styles["quick-action-button"]}>
      <span className={styles["quick-action-content"]}>
        <span className={styles["quick-action-icon"]}>{icon}</span>
        <span className={styles["quick-action-label"]}>{label}</span>
      </span>
    </button>
  );
}