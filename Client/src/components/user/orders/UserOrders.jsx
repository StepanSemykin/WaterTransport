import { useState } from "react";
import TripCard from "../../dashboards/TripCard.jsx";
import { ChevronDown } from "lucide-react";

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
  const [expandedSections, setExpandedSections] = useState({
    possible: true,
    pending: false,
    rejected: false,
    upcoming: true,
    completed: false,
  });

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

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

  const SectionHeader = ({ title, sectionId, count }) => (
    <button
      onClick={() => toggleSection(sectionId)}
      className={styles["user-section-header"]}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0"
      }}
    >
      <h2 className={styles["user-section-title"]}>
        {title} {count > 0 && <span>({count})</span>}
      </h2>
      <ChevronDown
        size={24}
        style={{
          transform: expandedSections[sectionId] ? "rotate(0deg)" : "rotate(-90deg)",
          transition: "transform 0.3s ease",
          flexShrink: 0
        }}
      />
    </button>
  );

  return (
    <div className="user-orders">

      {possibleTrips !== null && (
        <section className={styles["user-section"]}>
          <SectionHeader 
            title="Заявки" 
            sectionId="possible"
            count={possibleTrips?.length || 0}
          />
          {expandedSections.possible && (
            <>
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
            </>
          )}
        </section>
      )}

      {pendingTrips !== null && (
        <section className={styles["user-section"]}>
          <SectionHeader 
            title="Отправленные заявки" 
            sectionId="pending"
            count={pendingTrips?.length || 0}
          />
          {expandedSections.pending && (
            <>
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
            </>
          )}
        </section>
      )}

      {rejectedTrips !== null && (
        <section className={styles["user-section"]}>
          <SectionHeader 
            title="Отклоненные заявки" 
            sectionId="rejected"
            count={rejectedTrips?.length || 0}
          />
          {expandedSections.rejected && (
            <>
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
            </>
          )}
        </section>
      )}

      <section className={styles["user-section"]}>
        <SectionHeader 
          title="Предстоящие" 
          sectionId="upcoming"
          count={upcomingTrips?.length || 0}
        />
        {expandedSections.upcoming && (
          <>
            {upcomingTripsLoading ? (
              <div className={styles["user-empty"]}>Загрузка…</div>
            ) : hasUpcoming ? (
              <div className={styles["user-card-list"]}>
                {upcomingTrips.map((trip, index) => (
                  <div className={styles["user-card"]} key={`${trip.id ?? trip.tripId ?? "up"}-${index}`}>
                    <TripCard
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
          </>
        )}
      </section>

      <section className={styles["user-section"]}>
        <SectionHeader 
          title="Завершённые" 
          sectionId="completed"
          count={completedTrips?.length || 0}
        />
        {expandedSections.completed && (
          <>
            {completedTripsLoading ? (
              <div className={styles["user-empty"]}>Загрузка…</div>
            ) : hasCompleted ? (
              <div className={styles["user-card-list"]}>
                {completedTrips.map((trip, index) => (
                  <TripCard
                    key={`${trip.id ?? trip.tripId ?? "completed"}-${index}`}
                    rentOrder={trip}
                    isPartner={isPartner}
                    onUpdateTripPrice={onUpdateTripPrice}
                  />
                ))}
              </div>
            ) : (
              <div className={styles["user-empty"]}>{emptyCompletedText}</div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
