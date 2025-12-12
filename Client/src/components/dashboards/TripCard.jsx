import { useState, useEffect, useMemo } from "react";

import { useAuth } from "../auth/AuthContext.jsx";
import TripDetails from "./TripDetails.jsx";

import styles from "./TripCard.module.css";

import PortIcon from "../../assets/port.png";
import WheelIcon from "../../assets/wheel.png";
import DateIcon from "../../assets/date.png";

const FORMAT_IMG = "base64";

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function formatDateTime(dt) {
  if (!dt) return { date: "", time: "" };

  try {
    const d = new Date(dt);
    return {
      date: d.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  } 
  catch {
    return { date: "", time: "" };
  }
}

function getPortNameById(ports, id) {
  if (!id) return "";
  const p = ports.find((x) => x.id === id);
  return p?.title ?? "";
}

function buildDateDetails(details, rentalStartTime) {
  if (Array.isArray(details) && details.length > 0) {
    return details;
  }

  const { date, time } = formatDateTime(rentalStartTime);
  return [
    { iconSrc: DateIcon, iconAlt: "Дата", text: date },
    { text: time },
  ];
}

function buildConfirmLabel(confirm, status, isRejected, isPending) {
  if (confirm) return confirm;

  if (status === "Agreed") return "Подтверждено";
  if (status === "AwaitingResponse") return "Ожидает";
  if ((status === "Discontinued") || (status === "HasOffers" && isRejected) || (status === "Cancelled")) return "Отклонено";
  if (status === "HasOffers" && isPending) return "Отправлено";
  if (status === "Completed") return "Завершено";

  return "";
}

function buildTitle(title, shipInfo) {
  if (title) return title;

  return {
    iconSrc: WheelIcon,
    iconAlt: "Судно",
    text: shipInfo?.name ?? "Судно",
  };
}

function normalizeDetailsToText(detailsArray) {
  const arr = Array.isArray(detailsArray) ? detailsArray : [];
  const parts = arr
    .map((d) => (typeof d?.text === "string" ? d.text.trim() : ""))
    .filter(Boolean);
  return parts.join(" ");
}

export default function TripCard({
  rentOrder = null,
  imageSrc,
  imageAlt,
  title,
  confirm,
  details,
  captain,
  portDeparture,
  portArrival,
  passengers,
  rating = [],
  actions = [],
  onAction,
  isPartner = false,
  isPending = false,
  isRejected = false,
  ...tripRest
}) {
  const { ports } = useAuth();
  const windowWidth = useWindowWidth();
  const [showDetails, setShowDetails] = useState(false);

  const tripData = useMemo(() => {
    if (!rentOrder) {
      const detailsArray = details ?? [];
      const dateTimeText = normalizeDetailsToText(detailsArray);

      return {
        id: tripRest.id,
        imageSrc,
        imageAlt,
        title,
        confirm,
        details: detailsArray,
        captain,
        portDeparture,
        portArrival,
        passengers,
        rating,
        actions,
        status: tripRest.status,
        rentOrder,
        totalPrice,
        dateTimeText,
        ...tripRest,
      };
    }

    const imageFromOrder = rentOrder?.ship?.primaryImageUrl
      ? `data:${rentOrder?.ship?.primaryImageMimeType};${FORMAT_IMG},${rentOrder?.ship?.primaryImageUrl}`
      : undefined;

    const finalImageSrc = imageSrc ?? imageFromOrder;
    const finalImageAlt = imageAlt ?? rentOrder?.ship?.name ?? "Судно";

    const titleObj = buildTitle(title, rentOrder?.ship);

    const portDepartureObj =
      portDeparture ??
      (rentOrder.departurePortId || rentOrder.departurePort
        ? {
            iconSrc: PortIcon,
            iconAlt: "Пристань",
            text:
              getPortNameById(ports, rentOrder.departurePortId) ||
              rentOrder.departurePort?.title ||
              "",
          }
        : null);

    const portArrivalObj =
      portArrival ??
      (rentOrder.arrivalPortId || rentOrder.arrivalPort
        ? {
            iconSrc: PortIcon,
            iconAlt: "Пристань",
            text:
              getPortNameById(ports, rentOrder.arrivalPortId) ||
              rentOrder.arrivalPort?.title ||
              "",
          }
        : null);

    const confirmLabel = buildConfirmLabel(confirm, rentOrder.status, isRejected, isPending);

    const detailsArray = buildDateDetails(details, rentOrder.rentalStartTime);
    const dateTimeText = normalizeDetailsToText(detailsArray);

    const actionsArray =
      Array.isArray(actions) && actions.length > 0
        ? actions
        : [{ key: "details", label: "Посмотреть детали" }];

    return {
      id: rentOrder.id,
      passengers: rentOrder.numberOfPassengers ?? passengers,
      status: rentOrder.status,
      shipId: rentOrder.shipId ?? rentOrder.ship?.id ?? null,

      imageSrc: finalImageSrc,
      imageAlt: finalImageAlt,
      title: titleObj,
      confirm: confirmLabel,
      details: detailsArray,
      captain,
      portDeparture: portDepartureObj,
      portArrival: portArrivalObj,
      rating,
      actions: actionsArray,
      rentOrder,
      dateTimeText,
      ...tripRest,
    };
  }, [
    rentOrder,
    imageSrc,
    imageAlt,
    title,
    confirm,
    details,
    captain,
    portDeparture,
    portArrival,
    passengers,
    rating,
    actions,
    ports,
    tripRest,
  ]);

  const visibleActions = useMemo(() => {
    const allActions = tripData.actions ?? [];
    if (!allActions.length) return [];
    return windowWidth < 750 ? allActions.slice(0, 1) : allActions;
  }, [tripData.actions, windowWidth]);

  function handleActionClick(action) {
    if (!action) return;

    const key = action.key ?? action.type;
    const isDetails = key === "details";

    if (isDetails) {
      setShowDetails(true);
    }

    action.onClick?.(tripData, action);
    onAction?.(action, tripData);
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["card"]}>
        <div className={styles["media-row"]}>
          {tripData.imageSrc && (
            <img
              src={tripData.imageSrc}
              alt={tripData.imageAlt}
              className={styles["media"]}
            />
          )}

          <div className={styles["content"]}>
            <div className={styles["header"]}>
              {tripData.title && (
                <div className={styles["title"]}>
                  {tripData.title.iconSrc && (
                    <img
                      src={tripData.title.iconSrc}
                      alt={tripData.title.iconAlt}
                      className={styles["title-icon"]}
                    />
                  )}
                  <span className={styles["title-text"]}>
                    {tripData.title.text}
                  </span>
                </div>
              )}

              <div className={styles["captain-port"]}>
                {captain?.text && (
                  <div className={styles["captain"]}>
                    {captain.iconSrc && (
                      <img
                        src={captain.iconSrc}
                        alt={captain.iconAlt}
                        className={styles["captain-icon"]}
                      />
                    )}
                    <span className={styles["captain-text"]}>
                      {captain.text}
                    </span>
                  </div>
                )}

                {tripData.portDeparture?.text && (
                  <div className={styles["port"]}>
                    {tripData.portDeparture.iconSrc && (
                      <img
                        src={tripData.portDeparture.iconSrc}
                        alt={tripData.portDeparture.iconAlt}
                        className={styles["port-icon"]}
                      />
                    )}
                    <span className={styles["port-text"]}>
                      {tripData.portDeparture.text}
                    </span>
                  </div>
                )}

                {tripData.portArrival?.text && (
                  <div className={styles["port"]}>
                    {tripData.portArrival.iconSrc && (
                      <img
                        src={tripData.portArrival.iconSrc}
                        alt={tripData.portArrival.iconAlt}
                        className={styles["port-icon"]}
                      />
                    )}
                    <span className={styles["port-text"]}>
                      {tripData.portArrival.text}
                    </span>
                  </div>
                )}
              </div>

              {tripData.dateTimeText && (
                <div className={styles["detail-group"]}>
                  <div className={styles["detail-line"]}>
                    <img
                      src={DateIcon}
                      alt="Дата"
                      className={styles["detail-icon"]}
                    />
                    <span>Дата: {tripData.dateTimeText}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles["meta"]}>
              {tripData.confirm && (
                <span className={styles["confirm"]}>
                  {tripData.confirm}
                </span>
              )}

              {Array.isArray(rating) && rating.length > 0 && (
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
              onClick={() => handleActionClick(action)}
            >
              {action.label && <span>{action.label}</span>}
              {action.iconSrc && (
                <img
                  src={action.iconSrc}
                  alt={
                    action.iconAlt ??
                    action.ariaLabel ??
                    action.label ??
                    ""
                  }
                  className={styles["action-icon"]}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <TripDetails
        trip={tripData}
        show={showDetails}
        onClose={() => setShowDetails(false)}
        isPartner={isPartner}
        isPending={isPending}
        isRejected={isRejected}
      />
    </div>
  );
}
