import TripCard from "../../dashboards/TripCard.jsx";

import styles from "./UserOrders.module.css";

export default function UserOrders({ 
  upcomingTrips,
  upcomingTripsLoading = false,
  completedTrips,
  completedTripsLoading = false,
  possibleTrips = null,
  possibleTripsLoading = false,
  pendingTrips = null,
  pendingTripsLoading = false,
  rejectedTrips = null,
  rejectedTripsLoading = null,
  isPartner = false,
  onUpdateTripPrice,
}) {
  const hasUpcoming = !upcomingTripsLoading && Array.isArray(upcomingTrips) && upcomingTrips.length > 0;
  const hasCompleted = !completedTripsLoading && Array.isArray(completedTrips) && completedTrips.length > 0;
  const hasPossible = !possibleTripsLoading && Array.isArray(possibleTrips) && possibleTrips.length > 0;
  const hasPending = !pendingTripsLoading && Array.isArray(pendingTrips) && pendingTrips.length > 0;
  const hasRejected = !rejectedTripsLoading && Array.isArray(rejectedTrips) && rejectedTrips.length > 0;

  const emptyUpcomingText = "На данный момент у вас нет предстоящих заказов";
  const emptyCompletedText = "На данный момент у вас нет завершённых заказов";
  const emptyPossibleText = "На данный момент у вас нет заявок";
  const emptyPendingText = "На данный момент у вас нет отправленных заявок";
  const emptyRejectedText = "На данный момент у вас нет отклоненных заявок";

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

      {pendingTrips !== null && (
        <section className={styles["user-section"]}>
          <h2 className={styles["user-section-title"]}>Отправленные заявки</h2>
          {pendingTripsLoading ? (
            <div className={styles["user-empty"]}>Загрузка…</div>
          ) : hasPending ? (
            <div className={styles["user-card-list"]}>
              {pendingTrips.map((trip, index) => (
                <TripCard
                  key={`${trip.id ?? trip.tripId ?? "pending"}-${index}`}
                  rentOrder={trip}
                  isPartner={isPartner}
                  isPending={true}
                  onUpdateTripPrice={onUpdateTripPrice}
                />
              ))}
            </div>
          ) : (
            <div className={styles["user-empty"]}>{emptyPendingText}</div>
          )}
        </section>
      )}

      {rejectedTrips !== null && (
        <section className={styles["user-section"]}>
          <h2 className={styles["user-section-title"]}>Отклоненные заявки</h2>
          {rejectedTripsLoading ? (
            <div className={styles["user-empty"]}>Загрузка…</div>
          ) : hasRejected ? (
            <div className={styles["user-card-list"]}>
              {rejectedTrips.map((trip, index) => (
                <TripCard
                  key={`${trip.id ?? trip.tripId ?? "reject"}-${index}`}
                  rentOrder={trip}
                  isPartner={isPartner}
                  isRejected={true}
                  onUpdateTripPrice={onUpdateTripPrice}
                />
              ))}
            </div>
          ) : (
            <div className={styles["user-empty"]}>{emptyRejectedText}</div>
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
              <div className={styles["user-card"]}>
                <TripCard
                  key={`${trip.id ?? trip.tripId ?? "up"}-${index}`}
                  rentOrder={trip}
                  isPartner={isPartner}
                  onUpdateTripPrice={onUpdateTripPrice}
                />
              </div>
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
                key={`${trip.id ?? trip.tripId ?? "up"}-${index}`}
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
    </div>
  );
}
