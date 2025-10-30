import { TripCard } from "../../dashboards/TripCard.jsx";

import styles from "./UserOrders.module.css";

export default function UserOrders({ upcomingTrips, completedTrips, possibleTrips = null }) {
  const hasUpcoming = upcomingTrips?.length > 0;
  const hasCompleted = completedTrips?.length > 0;
  const hasPossible = possibleTrips?.length > 0;

  return (
    <div className="user-orders">

      {hasPossible && (
        <section className={styles["user-section"]}>
          {(hasUpcoming || hasCompleted) && <div className={styles["user-divider"]} />}
          <h2 className={styles["user-section-title"]}>Возможные</h2>
          <div className={styles["user-card-list"]}>
            {possibleTrips.map((trip) => (
              <TripCard key={trip.title} {...trip} />
            ))}
          </div>
        </section>
      )}

      {hasUpcoming && (
        <section className={styles["user-section"]}>
          <h2 className={styles["user-section-title"]}>Предстоящие</h2>
          <div className={styles["user-card-list"]}>
            {upcomingTrips.map((trip) => (
              <TripCard key={trip.title} {...trip} />
            ))}
          </div>
        </section>
      )}

      {hasCompleted && (
        <section className={styles["user-section"]}>
          {hasUpcoming && <div className={styles["user-divider"]} />}
          <h2 className={styles["user-section-title"]}>Завершённые</h2>
          <div className={styles["user-card-list"]}>
            {completedTrips.map((trip) => (
              <TripCard key={trip.title} {...trip} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
