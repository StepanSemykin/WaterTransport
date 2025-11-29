import { TripCard } from "../../dashboards/TripCard.jsx";

import styles from "./UserOrders.module.css";

export default function UserOrders({ 
  upcomingTrips, 
  completedTrips, 
  possibleTrips = null, 
  isPartner = false,
  onUpdateTripPrice, 
}) {
  const hasUpcoming = upcomingTrips?.length > 0;
  const hasCompleted = completedTrips?.length > 0;
  const hasPossible = possibleTrips?.length > 0;

  return (
    <div className="user-orders">

      {possibleTrips !== null && (
        hasPossible ? (
          <section className={styles["user-section"]}>
            {(hasUpcoming || hasCompleted) && (
              <div className={styles["user-divider"]} />
            )}
            <h2 className={styles["user-section-title"]}>Заявки</h2>
            <div className={styles["user-card-list"]}>
              {possibleTrips.map((trip) => (
                // <TripCard key={trip.title} {...trip} />
                <TripCard
                  key={trip?.id ?? trip?.title ?? `possible-${index}`}
                  {...trip}
                  isPartner={isPartner}
                  onUpdateTripPrice={onUpdateTripPrice}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className={styles["user-section"]}>
            <h2 className={styles["user-section-title"]}>Заявки</h2>
            <div className={styles["user-empty"]}>
              На данный момент у вас нет заявок
            </div>
          </section>
        )
      )}

      {hasUpcoming ? (
        <section className={styles["user-section"]}>
          <h2 className={styles["user-section-title"]}>Предстоящие</h2>
          <div className={styles["user-card-list"]}>
            {upcomingTrips.map((trip) => (
              // <TripCard key={trip.title} {...trip} />
               <TripCard
                key={trip?.id ?? trip?.title ?? `upcoming-${index}`}
                {...trip}
                isPartner={isPartner}
                onUpdateTripPrice={onUpdateTripPrice}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className={styles["user-section"]}>
          <h2 className={styles["user-section-title"]}>Предстоящие</h2>
          <div className={styles["user-empty"]}>На данный момент у вас нет предстоящих заказов</div>
        </section>
      )}

      {hasCompleted ? (
        <section className={styles["user-section"]}>
          {hasUpcoming && <div className={styles["user-divider"]} />}
          <h2 className={styles["user-section-title"]}>Завершённые</h2>
          <div className={styles["user-card-list"]}>
            {completedTrips.map((trip) => (
              // <TripCard key={trip.title} {...trip} />
              <TripCard
                key={trip?.id ?? trip?.title ?? `completed-${index}`}
                {...trip}
                isPartner={isPartner}
                onUpdateTripPrice={onUpdateTripPrice}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className={styles["user-section"]}>
          <h2 className={styles["user-section-title"]}>Завершённые</h2>
          <div className={styles["user-empty"]}>На данный момент у вас нет завершённых заказов</div>
        </section>
      )}

    </div>
  );
}
