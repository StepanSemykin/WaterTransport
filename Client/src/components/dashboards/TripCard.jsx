import { useState, useEffect } from "react";

import styles from "./TripCard.module.css";

export function TripCard({
  imageSrc,
  imageAlt,
  title,
  status,
  details = [],
  captain,
  port,
  rating,
  actions = [],
}) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleActions =
    windowWidth < 750 ? actions.slice(0, 1) : actions;

  return (
    <div className={styles["card"]}>
      <div className={styles["media-row"]}>
        <img src={imageSrc} alt={imageAlt} className={styles["media"]} />
        <div className={styles["content"]}>
          <div className={styles["header"]}>
            <h3 className={styles["title"]}>
              <span className={styles["title"]}>{title}</span>
            </h3>
            <div className={styles["captain-port"]}>
              {captain && (
                <div className={styles["captain"]}>
                  <span>{captain}</span>
                </div>
              )}
              {port && (
                <div className={styles["port"]}>
                  <span>{port}</span>
                </div>
              )}
            </div>
            <div className={styles["detail-group"]}>
              {details.map((detail) => (
                <div key={detail.text} className={styles["detail-line"]}>
                  {detail.iconSrc && (
                    <img
                      src={detail.iconSrc}
                      alt={detail.iconAlt ?? ""}
                      className={styles["detail-icon"]}
                    />
                  )}
                  <span>{detail["text"]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles["meta"]}>
            {status && <span className={styles["status"]}>{status}</span>}
            {rating && (
              <div className={styles["rating"]}>
                {rating.map((icon, index) => (
                  <img
                    key={`${icon.src}-${index}`}
                    src={icon.src}
                    alt={icon.alt}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles["actions"]}>
        {visibleActions.map((action, index) => (
          <button
            key={`${action.label ?? "icon"}-${index}`}
            type="button"
            className={`${styles["action-btn"]} ${
              !action.label ? styles.actionIconOnly : ""
            }`.trim()}
            aria-label={action.ariaLabel ?? action.label}
          >
            {action.label && <span>{action.label}</span>}
            {action.iconSrc && (
              <img
                src={action.iconSrc}
                alt={action.iconAlt ?? action.ariaLabel ?? action.label ?? ""}
                className={styles["action-icon"]}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}