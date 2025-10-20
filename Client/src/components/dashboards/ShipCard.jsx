import { useState, useEffect } from "react";

import styles from "./ShipCard.module.css";

export function ShipCard({
  imageSrc = "",
  imageAlt = "",
  title = "",
  status = "",
  type = "",
  details = [],
  rating = "",
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

  const visibleActions = windowWidth < 750 ? actions.slice(0, 1) : actions;

  return (
    <div className={styles["card"]}>

      <div className={styles["media-row"]}>
        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className={styles["media"]}
          />
        )}

        <div className={styles["content"]}>
          <div className={styles["header"]}>
            <h3 className={styles["title"]}>{title}</h3>

            {type && (
              <span className={styles["type"]}>
                {type}
              </span>
            )}

            {details.length > 0 && (
              <div className={styles["detail-group"]}>
                {details.map((detail, i) => (
                  <div key={i} className={styles["detail-line"]}>
                    {detail.iconSrc && (
                      <img
                        src={detail.iconSrc}
                        alt={detail.iconAlt ?? ""}
                        className={styles["detail-icon"]}
                      />
                    )}
                    <span>{detail.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles["meta"]}>
            {status && <span className={styles["status"]}>{status}</span>}

            {rating && Array.isArray(rating) && rating.length > 0 && (
              <div className={styles["rating"]}>
                {rating.map((icon, index) => (
                  <img
                    key={`${icon.src}-${index}`}
                    src={icon.src}
                    alt={icon.alt ?? "звезда"}
                    className={styles["rating-icon"]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {visibleActions.length > 0 && (
        <div className={styles["actions"]}>
          {visibleActions.map((action, index) => (
            <button
              key={`${action.label ?? "icon"}-${index}`}
              type="button"
              className={`${styles["action-btn"]} ${
                !action.label ? styles["actionIconOnly"] : ""
              }`.trim()}
              aria-label={action.ariaLabel ?? action.label ?? "Кнопка действия"}
            >
              {action.label && <span>{action.label}</span>}
              {action.iconSrc && (
                <img
                  src={action.iconSrc}
                  alt={
                    action.iconAlt ??
                    action.ariaLabel ??
                    action.label ??
                    "иконка"
                  }
                  className={styles["action-icon"]}
                />
              )}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
