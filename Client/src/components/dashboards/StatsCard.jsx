import "bootstrap/dist/css/bootstrap.min.css";

import styles from "./StatsCard.module.css";

export function StatsCard({ title, value }) {
  return (
    <div className={styles["card"]}>

      <span className={styles["title"]}>
        {title}
      </span>
      <span className={styles["value"]}>{value}</span>
      
    </div>
  );
}
