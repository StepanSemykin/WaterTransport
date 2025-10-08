import { TripCard } from "../dashboards/TripCard.jsx";

import styles from "./UserOrders.module.css";

import ChatIcon from "../../assets/chat.png";
import YachtIcon from "../../assets/yacht.png";
import StarIcon from "../../assets/star.png";
import StarOffIcon from "../../assets/starOff.png";

const UPCOMING_TRIPS = [
  {
    imageSrc: YachtIcon,
    imageAlt: "Luxury Yacht Marina",
    title: "Luxury Yacht Marina",
    status: "Не подтверждено",
    captain: "Сергей Иванов",
    port: "Речной вокзал",
    details: [
      { text: "07.07.2025" },
      { text: "12:00" },
    ],
    actions: [
      { label: "Посмотреть детали" },
      { label: "Отменить поездку" },
      { iconSrc: ChatIcon, ariaLabel: "Открыть чат" },
    ],
  },
];

const COMPLETED_TRIPS = [
  {
    imageSrc: YachtIcon,
    imageAlt: "Luxury Yacht Marina",
    title: "Luxury Yacht Marina",
    captain: "Сергей Иванов",
    port: "Речной вокзал",
    details: [
      { text: "06.06.2025" },
      { text: "12:00" },
    ],
    rating: [StarIcon, StarIcon, StarIcon, StarOffIcon, StarOffIcon], 
    actions: [
      { label: "Посмотреть детали" },
      { label: "Заказать снова" },
      { label: "Помощь" },
      { iconSrc: ChatIcon, ariaLabel: "Открыть чат" },
    ],
  },
];

export default function UserOrders() {
  return (
    <div className="user-orders">
      <section className={styles["user-section"]}>
        <h2 className={styles["user-section-title"]}>Предстоящие</h2>
        <div className={styles["user-card-list"]}>
          {UPCOMING_TRIPS.map((trip) => (
            <TripCard key={trip.title} {...trip} />
          ))}
        </div>
      </section>

      <div className={styles["user-divider"]} />

      <section className={styles["user-section"]}>
        <h2 className={styles["user-section-title"]}>Завершённые</h2>
        <div className={styles["user-card-list"]}>
          {COMPLETED_TRIPS.map((trip) => (
            <TripCard key={trip.title} {...trip} />
          ))}
        </div>
      </section>
    </div>
  );
}