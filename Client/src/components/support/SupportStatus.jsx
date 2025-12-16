import styles from "./SupportStatus.module.css";

export default function StatusBadge({ type, variant, children }) {
  const className =
    type === "priority"
      ? styles[`priority-${variant}`]
      : styles[`status-${variant}`];

  return <span className={`${styles.badge} ${className}`}>{children}</span>;
}
