import { useState } from "react";

import { ShipCard } from "../../dashboards/ShipCard.jsx";
import { AddShip } from "./AddShip.jsx";

import styles from "../orders/UserOrders.module.css";

export default function UserShips({ ships }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveShip = (shipData) => {
    console.log("Сохраненные данные:", shipData);
    // Здесь логика сохранения судна
  };

  return (
    <div className="user-ships">

        <section className={styles["user-section"]}>
          <div className={styles["user-section-button"]}>
            <button className={styles["add-button"]} 
              onClick={() => setIsModalOpen(true)}>
              Добавить судно
            </button>

            <AddShip
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveShip}
            />
          </div>
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
