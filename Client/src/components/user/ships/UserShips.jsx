import { ShipCard } from "../../dashboards/ShipCard.jsx";

import styles from "../orders/UserOrders.module.css";

export default function UserShips({ ships }) {
  
  return (
    <div className="user-ships">

        <section className={styles["user-section"]}>
        <h2 className={styles["user-section-title"]}>Мои суда</h2>
        <div className={styles["user-card-list"]}>
            {ships.map((ship) => (
            <ShipCard key={ship.title} {...ship} />
            ))}
        </div>
        </section>

    </div>
  );
}
