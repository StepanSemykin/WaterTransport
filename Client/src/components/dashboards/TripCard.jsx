import { useState, useEffect } from "react";

import { useAuth } from "../auth/AuthContext.jsx";
import TripDetails from "./TripDetails.jsx";

import styles from "./TripCard.module.css";

import PortIcon from "../../assets/port.png"
import WheelIcon from "../../assets/wheel.png"
import DateIcon from "../../assets/date.png";

export function TripCard({
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
  onUpdateTripPrice,
  ...tripRest
}) {
  const { ports, shipTypes, userShips } = useAuth();

  const [showDetails, setShowDetails] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // console.log(isPartner);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    } catch {
      return { date: "", time: "" };
    }
  }

  function getPortName(id) {
    if (!id) return "";
    const p = ports.find((x) => x.id === id);
    return p?.title ?? "";
  }

  function getShipData(shipId, shipTypeId) {
    if (shipId) {
      const ship = userShips.find((s) => s.id === shipId);
      if (ship) {
        return {
          name: ship.name ?? ship.title ?? "Судно",
          image: ship.primaryImage?.url ?? ship.images?.[0]?.url ?? "",
        };
      }
    }
    if (shipTypeId) {
      const st = shipTypes.find((t) => t.id === shipTypeId);
      return {
        name: st?.name ?? "Тип судна",
        image: "",
      };
    }
    return { name: "Заказ", image: "" };
  }

  let mapped = {};
  if (rentOrder) {
    const { date, time } = formatDateTime(rentOrder.rentalStartTime);
    const shipInfo = getShipData(rentOrder.shipId, rentOrder.shipTypeId);

    mapped = {
      id: rentOrder.id,
      passengers: rentOrder.numberOfPassengers,
      status: rentOrder.status,
      imageSrc: imageSrc ?? shipInfo.image,
      imageAlt: imageAlt ?? shipInfo.name,
      // заголовок — имя судна
      title: title ?? { iconSrc: WheelIcon, iconAlt: "Судно", text: shipInfo.name },
      // порты — объекты с text, чтобы JSX не ломался
      portDeparture:
        portDeparture ??
        {
          iconSrc: PortIcon, iconAlt: "Пристань", text: getPortName(rentOrder.departurePortId),
        },
      portArrival:
        portArrival ??
        (rentOrder.arrivalPortId
          ? { text: getPortName(rentOrder.arrivalPortId) }
          : null),
      confirm:
        confirm ??
        (rentOrder.status === "Agreed" ? "Подтверждено" : ""),

      // детали: если не передали свои, показываем дата + время
      details:
        details && details.length
          ? details
          : [
              { iconSrc: DateIcon, iconAlt: "Дата", text: date },
              { text: time },
            ],

      actions:
        actions && actions.length
          ? actions
          : [{ key: "details", label: "Посмотреть детали" }],
    };

    // Для отладки:
    // console.log("mapped.details", mapped.details);
    // console.log("rentalStartTime raw:", rentOrder.rentalStartTime);
  }

  const tripData = {
    imageSrc: mapped.imageSrc ?? imageSrc,
    imageAlt: mapped.imageAlt ?? imageAlt,
    title: mapped.title ?? title,
    confirm: mapped.confirm ?? confirm,
    details: mapped.details ?? details ?? [],
    captain,
    portDeparture: mapped.portDeparture ?? portDeparture,
    portArrival: mapped.portArrival ?? portArrival,
    passengers: mapped.passengers ?? passengers,
    rating,
    actions: mapped.actions ?? actions,
    status: mapped.status,
    rentOrder,
    ...tripRest,
  };

  const visibleActions =
    (tripData.actions ?? []).length && windowWidth < 750
      ? tripData.actions.slice(0, 1)
      : tripData.actions ?? [];

  function handleActionClick(action) {
    if (!action) return;
    const key = action.key ?? action.type;
    const isDetails = key === "details";
    if (isDetails) {
      setShowDetails(true);
      action.onClick?.(tripData, action);
      onAction?.(action, tripData);
      return;
    }
    action.onClick?.(tripData, action);
    onAction?.(action, tripData);
  }

  return (
    <>
      <div className={styles["card"]}>
        <div className={styles["media-row"]}>
          <img
            src={tripData.imageSrc}
            alt={tripData.imageAlt}
            className={styles["media"]}
          />
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
                {captain && captain.text && (
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

                {tripData.portDeparture &&
                  tripData.portDeparture.text && (
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

                {tripData.portArrival && tripData.portArrival.text && (
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

              <div className={styles["detail-group"]}>
                {(tripData.details ?? []).map((detail, index) => (
                  <div
                    key={index}
                    className={styles["detail-line"]}
                  >
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
            </div>

            <div className={styles["meta"]}>
              {tripData.confirm && (
                <span className={styles["confirm"]}>
                  {tripData.confirm}
                </span>
              )}
              {/* {tripData.passengers && (
                <span className={styles["passengers"]}>
                  Пассажиров: {tripData.passengers}
                </span>
              )} */}
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
        onUpdateTripPrice={onUpdateTripPrice}
      />
    </>
  );
}


// export function TripCard({
//   imageSrc = "",
//   imageAlt = "",
//   title = {},
//   confirm = "",
//   details = [],
//   captain = {},
//   portDeparture = {}, 
//   portArrival = {},
//   passengers = null,
//   rating = "",
//   actions = [],
//   onAction, 
//   isPartner = false,
//   onUpdateTripPrice,
//   ...tripRest
// }) {

//   const [showDetails, setShowDetails] = useState(false);

//   const [windowWidth, setWindowWidth] = useState(
//     typeof window !== "undefined" ? window.innerWidth : 0
//   );

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const visibleActions =
//     windowWidth < 750 ? actions.slice(0, 1) : actions;

//   const tripData = {
//     imageSrc,
//     imageAlt,
//     title,
//     confirm,
//     details,
//     captain,
//     portDeparture,
//     portArrival,
//     passengers,
//     rating,
//     actions,
//     ...tripRest,
//   };

//   function handleActionClick(action) {
//     if (!action) return;

//     const actionKey = action.key ?? action.type;
//     const actionLabel = action.label ?? "";
//     const isDetails =
//       actionKey === "details" || /детал/i.test(actionLabel);

//     if (isDetails) {
//       setShowDetails(true);
//       action.onClick?.(tripData, action);
//       onAction?.(action, tripData);
//       return;
//     }

//     if (action.onClick) {
//       action.onClick(tripData, action);
//     } 
//     else {
//       onAction?.(action, tripData);
//     }
//   }  

//   return (
//     <>
//       <div className={styles["card"]}>
        
//         <div className={styles["media-row"]}>
//           <img src={imageSrc} alt={imageAlt} className={styles["media"]} />
//           <div className={styles["content"]}>
//             <div className={styles["header"]}>
//               {title && (
//                 <div className={styles["title"]}>
//                   {title.iconSrc && (
//                     <img 
//                       src={title.iconSrc}
//                       alt={title.iconAlt}
//                       className={styles["title-icon"]}
//                     />
//                   )}
//                   <span className={styles["title-text"]}>{title.text}</span>
//                 </div>
//               )}
//               <div className={styles["captain-port"]}>
//                 {captain && (
//                   <div className={styles["captain"]}>
//                     {captain.iconSrc && (
//                       <img 
//                         src={captain.iconSrc}
//                         alt={captain.iconAlt}
//                         className={styles["captain-icon"]}
//                       />
//                     )}
//                     <span className={styles["captain-text"]}>{captain.text}</span>
//                   </div>
//                 )}
//                 {portDeparture && (
//                   <div className={styles["port"]}>
//                     {portDeparture.iconSrc && (
//                       <img
//                         src={portDeparture.iconSrc}
//                         alt={portDeparture.iconAlt}
//                         className={styles["port-icon"]}
//                       />
//                     )}
//                     <span className={styles["port-text"]}>{portDeparture.text}</span>
//                   </div>
//                 )}
//               </div>
//               <div className={styles["detail-group"]}>
//                 {details.map((detail) => (
//                   <div key={detail.text} className={styles["detail-line"]}>
//                     {detail.iconSrc && (
//                       <img
//                         src={detail.iconSrc}
//                         alt={detail.iconAlt ?? ""}
//                         className={styles["detail-icon"]}
//                       />
//                     )}
//                     <span>{detail["text"]}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className={styles["meta"]}>
//               {confirm && <span className={styles["confirm"]}>{confirm}</span>}
//               {rating && (
//                 <div className={styles["rating"]}>
//                   {rating.map((icon, index) => (
//                     <img
//                       key={`${icon.src}-${index}`}
//                       src={icon.src}
//                       alt={icon.alt}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className={styles["actions"]}>
//           {visibleActions.map((action, index) => (
//             <button
//               key={`${action.label ?? "icon"}-${index}`}
//               type="button"
//               className={`${styles["action-btn"]} ${
//                 !action.label ? styles.actionIconOnly : ""
//               }`.trim()}
//               aria-label={action.ariaLabel ?? action.label}
//               onClick={() => handleActionClick(action)}
//             >
//               {action.label && <span>{action.label}</span>}
//               {action.iconSrc && (
//                 <img
//                   src={action.iconSrc}
//                   alt={action.iconAlt ?? action.ariaLabel ?? action.label ?? ""}
//                   className={styles["action-icon"]}
//                 />
//               )}
//             </button>
//           ))}
//         </div>

//       </div>
//       <TripDetails
//         trip={tripData}
//         show={showDetails}
//         onClose={() => setShowDetails(false)}
//         isPartner={isPartner}
//         onUpdateTripPrice={onUpdateTripPrice}
//       />
//     </>
//   );
// }