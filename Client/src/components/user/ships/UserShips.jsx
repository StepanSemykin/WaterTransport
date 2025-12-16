import { useState, useMemo } from "react";

import { useAuth } from "../../auth/AuthContext";
import { AddShipModal } from "./AddShipModal.jsx";
import { EditShipModal } from "./EditShipModal.jsx";
import ShipCard from "../../dashboards/ShipCard.jsx";

import styles from "./UserShips.module.css";

import ShipIcon from "../../../assets/ship.png"
import PassengersIcon from "../../../assets/passengers.png"

export default function UserShips() {
  const { user, userShips, userShipsLoading, loadUserShips, shipTypes } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);

  const shipTypesMap = useMemo(() => {
    if (!Array.isArray(shipTypes)) return {};
    return shipTypes.reduce((acc, type) => {
      acc[type.id] = type.title || type.name || "Не указан";
      return acc;
    }, {});
  }, [shipTypes]);

  const handleSaveShip = async (shipData) => {
    console.log("Сохраненные данные:", shipData);
    if (user?.id) {
      await loadUserShips(user.id);
    }
  };

  const handleEditShip = (ship) => {
    setSelectedShip(ship);
    setIsEditModalOpen(true);
  };

  const formatShipForCard = (ship) => {
    return {
      name: { iconSrc: ShipIcon, iconAlt: "судно", text: ship.name || "Без названия" },
      type: { iconSrc: ShipIcon, iconAlt: "судно", text: shipTypesMap[ship.shipTypeId] || ship.shipType?.title || ship.shipType?.name || "Не указан" },

      details: [
        { iconSrc: PassengersIcon, iconAlt: "пассажиры", text: `До ${ship.capacity || 0} человек` }
      ],
      status: "Активно", 
      rating: 5.0,
      imageSrc: ship.primaryImage?.url || ship.images?.[0]?.url || "/placeholder-ship.jpg",
      imageAlt: ship.name || "Изображение судна", 
      actions: [
        { label: "Посмотреть детали" }
      ],
    };
  };

  if (userShipsLoading) {
    return (
      <div className="user-ships">
        <section className={styles["user-section"]}>
          <p>Загрузка судов...</p>
        </section>
      </div>
    );
  }

  return (
    <div className={styles["user-ships"]}>

        <section className={styles["user-section"]}>
          <div className={styles["user-section-button"]}>
            <button 
              className={styles["add-button"]} 
              onClick={() => setIsModalOpen(true)}
            >
              Добавить судно
            </button>
            <AddShipModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveShip}
            />
            <EditShipModal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedShip(null);
              }}
              ship={selectedShip}
              onSave={handleSaveShip}
          />
          </div>
          <h2 className={styles["user-section-title"]}>Мои суда</h2>
          {userShips.length === 0 ? (
            <p className={styles["empty-message"]}>
              На данный момент у вас нет добавленных судов
            </p>
          ) : (
            <div className={styles["user-card-list"]}>
              {userShips.map((ship) => (
                <div 
                  className={styles["user-card"]} 
                  key={ship.id} 
                  onClick={() => handleEditShip(ship)}>
                  <ShipCard {...formatShipForCard(ship)} />
              </div>
              ))}
            </div>
          )}    
        </section>

    </div>
  );
}
