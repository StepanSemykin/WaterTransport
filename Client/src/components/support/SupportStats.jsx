import styles from "./SupportStats.module.css";
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  UsersRound, 
  TrendingUp, 
  Settings,
  Star
} from "lucide-react";

export default function Statistics() {
  return (
    <div>
      <div className={styles["kpi-grid"]}>
        <StatCard
          icon={<Clock className={`${styles["stat-icon"]} ${styles["stat-icon-primary"]}`} />}
          title="Всего обращений"
          value="234"
        />
        <StatCard
          icon={<AlertTriangle className={`${styles["stat-icon"]} ${styles["stat-icon-warning"]}`} />}
          title="Открытых"
          value="45"
        />
        <StatCard
          icon={<CheckCircle2 className={`${styles["stat-icon"]} ${styles["stat-icon-success"]}`} />}
          title="Решено сегодня"
          value="18"
        />
        <StatCard
          icon={<Clock className={`${styles["stat-icon"]} ${styles["stat-icon-info"]}`} />}
          title="Среднее время"
          value="2.5 мин"
        />
      </div>

      <div className={styles["satisfaction-card"]}>
        <div className={styles["card-content"]}>
          <h3>Удовлетворенность клиентов</h3>
          <div className={styles["rating-container"]}>
            <Star className={styles["rating-star"]} />
            <span className={styles["rating-value"]}>4.6</span>
            <span className={styles["rating-max"]}>из 5</span>
          </div>
          <p className={styles["rating-description"]}>Основано на отзывах за последние 30 дней</p>
        </div>
      </div>

      <div className={styles["quick-actions-card"]}>
        <div className={styles["card-content"]}>
          <h3>Быстрые действия</h3>
          <div className={styles["quick-actions-grid"]}>
            <QuickAction 
              icon={<FileText className={styles["action-icon"]} />} 
              label="Создать FAQ" 
            />
            <QuickAction 
              icon={<UsersRound className={styles["action-icon"]} />} 
              label="Групповая рассылка" 
            />
            <QuickAction 
              icon={<TrendingUp className={styles["action-icon"]} />} 
              label="Аналитика" 
            />
            <QuickAction 
              icon={<Settings className={styles["action-icon"]} />} 
              label="Настройки поддержки" 
            />
          </div>
        </div>
      </div>
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