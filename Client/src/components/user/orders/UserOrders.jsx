import { TripCard } from "../../dashboards/TripCard.jsx";

import styles from "./UserOrders.module.css";

export default function UserOrders({ 
  upcomingTrips,
  upcomingTripsLoading = false,
  completedTrips,
  completedTripsLoading = false,
  possibleTrips = null,
  possibleTripsLoading = false,
  isPartner = false,
  onUpdateTripPrice,
}) {
  const hasUpcoming = !upcomingTripsLoading && Array.isArray(upcomingTrips) && upcomingTrips.length > 0;
  const hasCompleted = !completedTripsLoading && Array.isArray(completedTrips) && completedTrips.length > 0;
  const hasPossible = !possibleTripsLoading && Array.isArray(possibleTrips) && possibleTrips.length > 0;

  const emptyUpcomingText = "На данный момент у вас нет предстоящих заказов";
  const emptyCompletedText = "На данный момент у вас нет завершённых заказов";
  const emptyPossibleText = "На данный момент у вас нет заявок";

  // console.log(isPartner);

  return (
    <div className="user-orders">

      {possibleTrips !== null && (
        <section className={styles["user-section"]}>
          <h2 className={styles["user-section-title"]}>Заявки</h2>
          {possibleTripsLoading ? (
            <div className={styles["user-empty"]}>Загрузка…</div>
          ) : hasPossible ? (
            <div className={styles["user-card-list"]}>
              {possibleTrips.map((trip, index) => (
                <TripCard
                  key={index}
                  rentOrder={trip}
                  isPartner={isPartner}
                  onUpdateTripPrice={onUpdateTripPrice}
                />
              ))}
            </div>
          ) : (
            <div className={styles["user-empty"]}>{emptyPossibleText}</div>
          )}
        </section>
      )}

      <section className={styles["user-section"]}>
        <h2 className={styles["user-section-title"]}>Предстоящие</h2>
        {upcomingTripsLoading ? (
          <div className={styles["user-empty"]}>Загрузка…</div>
        ) : hasUpcoming ? (
          <div className={styles["user-card-list"]}>
            {upcomingTrips.map((trip, index) => (
              <TripCard
                key={index}
                rentOrder={trip}
                isPartner={isPartner}
                onUpdateTripPrice={onUpdateTripPrice}
              />
            ))}
          </div>
        ) : (
          <div className={styles["user-empty"]}>{emptyUpcomingText}</div>
        )}
      </section>

      <section className={styles["user-section"]}>
        <h2 className={styles["user-section-title"]}>Завершённые</h2>
        {completedTripsLoading ? (
          <div className={styles["user-empty"]}>Загрузка…</div>
        ) : hasCompleted ? (
          <div className={styles["user-card-list"]}>
            {completedTrips.map((trip, index) => (
              <TripCard
                key={index}
                rentOrder={trip}
                isPartner={isPartner}
                onUpdateTripPrice={onUpdateTripPrice}
              />
            ))}
          </div>
        ) : (
          <div className={styles["user-empty"]}>{emptyCompletedText}</div>
        )}
      </section>

      {/* {possibleTrips !== null && (
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
      )} */}

    </div>
  );
}
