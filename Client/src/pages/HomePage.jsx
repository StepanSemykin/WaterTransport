import { useState } from "react";
import { Search, Bell, User, Menu as TabsMenu, MapPin, Calendar, Clock, Users, Minus, Plus } from "lucide-react";

import styles from "./HomePage.module.css";

export default function Index() {
  const [activeTab, setActiveTab] = useState("rental");
  const [addReturnRoute, setAddReturnRoute] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [comment, setComment] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const dec = (setter, value, min = 0) => () => setter(value > min ? value - 1 : min);
  const inc = (setter, value, max = 99) => () => setter(value < max ? value + 1 : max);

  return (
    <div className={styles["aquarent-page"]}>
      
      <header className={styles["header-wrapper"]}>
        <div className={styles["header-content"]}>
          <h1 className={styles["brand-title"]}>AquaRent</h1>
          <div className={styles["icon-group"]}>
            <button className={styles["menu-button"]} type="button" aria-label="Открыть меню">
              <TabsMenu />
            </button>
            <button className={styles["icon-button"]} type="button" aria-label="Поиск">
              <Search />
            </button>
            <button className={styles["icon-button"]} type="button" aria-label="Уведомления">
              <Bell />
            </button>
            <button className={styles["icon-button"]} type="button" aria-label="Профиль">
              <User />
            </button>
          </div>
        </div>
      </header>

      <section className={styles["map-section"]}>
        <div className={styles["map-container"]}>
          <img
            alt="Карта маршрута"
            className={styles["map-image"]}
          />
        </div>
      </section>

      <section className={styles["tabs-wrapper"]}>
        <div className={styles["tab-list"]}>
          <button
            type="button"
            onClick={() => setActiveTab("rental")}
            className={`${styles["tab-button"]} ${activeTab === "rental" ? styles["tab-button--active"] : ""}`.trim()}
          >
            Аренда
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("regular")}
            className={`${styles["tab-button"]} ${activeTab === "regular" ? styles["tab-button--active"] : ""}`.trim()}
          >
            Регулярные рейсы
          </button>
        </div>
      </section>

      <section className={styles["form-wrapper"]}>
        <div className={styles["form-card"]}>
          <div className={`${styles["form-section"]} ${styles["form-section--two-columns"]}`}>
            <div className={styles["field"]}>
              <label className={styles["field-label"]} htmlFor="from">Откуда</label>
              <div className={styles["input-wrapper"]}>
                <MapPin className={styles["input-icon"]} />
                <input
                  id="from"
                  type="text"
                  className={`${styles["field-input"]} ${styles["with-icon"]}`}
                  placeholder="Порт отправления"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
            </div>
            <div className={styles["field"]}>
              <label className={styles["field-label"]} htmlFor="to">Куда</label>
              <div className={styles["input-wrapper"]}>
                <MapPin className={styles["input-icon"]} />
                <input
                  id="to"
                  type="text"
                  className={`${styles["field-input"]} ${styles["with-icon"]}`}
                  placeholder="Порт прибытия"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={`${styles["form-section"]} ${styles["form-section--date-time"]}`}>
            <div className={styles["field"]}>
              <label className={styles["field-label"]} htmlFor="date">Дата</label>
              <div className={styles["input-wrapper"]}>
                <Calendar className={styles["input-icon"]} />
                <input
                  id="date"
                  type="date"
                  className={`${styles["field-input"]} ${styles["with-icon"]}`}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className={styles["field"]}>
              <label className={styles["field-label"]} htmlFor="time">Время</label>
              <div className={styles["input-wrapper"]}>
                <Clock className={styles["input-icon"]} />
                <input
                  id="time"
                  type="time"
                  className={`${styles["field-input"]} ${styles["with-icon"]}`}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles["form-checkbox"]}>
            <input
              id="return-route"
              type="checkbox"
              className={styles["form-checkbox-input"]}
              checked={addReturnRoute}
              onChange={(event) => setAddReturnRoute(event.target.checked)}
            />
            <label className={styles["field-label"]} htmlFor="return-route">
              Добавить обратный маршрут
            </label>
          </div>

          <div className={styles["form-grid-people"]}>
            <div className={styles["field"]}>
              <label className={styles["field-label"]} htmlFor="adults">Взрослые</label>
              <div className={styles["counter-wrapper"]}>
                <button type="button" className={styles["counter-btn"]} aria-label="Минус взрослые" onClick={dec(setAdults, adults, 1)}>
                  <Minus size={16} />
                </button>
                <input
                  id="adults"
                  type="number"
                  className={`${styles["field-input"]} ${styles["counter-input"]}`}
                  value={adults}
                  min={1}
                  readOnly
                />
                <button type="button" className={styles["counter-btn"]} aria-label="Плюс взрослые" onClick={inc(setAdults, adults)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className={styles["field"]}>
              <label className={styles["field-label"]} htmlFor="children">Дети</label>
              <div className={styles["counter-wrapper"]}>
                <button type="button" className={styles["counter-btn"]} aria-label="Минус дети" onClick={dec(setChildren, children, 0)}>
                  <Minus size={16} />
                </button>
                <input
                  id="children"
                  type="number"
                  className={`${styles["field-input"]} ${styles["counter-input"]}`}
                  value={children}
                  min={0}
                  readOnly
                />
                <button type="button" className={styles["counter-btn"]} aria-label="Плюс дети" onClick={inc(setChildren, children)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className={`${styles["field"]} ${styles["field--comment"]}`}>
              <label className={styles["field-label"]} htmlFor="comment">Комментарий</label>
              <textarea
                id="comment"
                className={styles["field-textarea"]}
                placeholder="Пожелания по рейсу, дополнительная информация"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className={styles["form-section"]}>
            <div className={`${styles["field"]} ${styles["field--transport"]}`}>
              <label className={styles["field-label"]} htmlFor="vehicle-type">Тип ТС</label>
              <div className={styles["input-wrapper"]}>
                <Users className={styles["input-icon"]} />
                <input
                  id="vehicle-type"
                  type="text"
                  className={`${styles["field-input"]} ${styles["with-icon"]} ${styles["transport-input"]}`}
                  placeholder="Катер, теплоход ..."
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles["submit-row"]}>
            <button type="button" className={styles["primary-button"]}>
              Найти
            </button>
          </div>
        </div>
      </section>
    
    </div>
  );
}
