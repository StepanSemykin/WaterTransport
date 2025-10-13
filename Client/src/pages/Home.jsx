import { useState } from "react";
import { Search, Bell, User, Menu, MapPin, Calendar, Clock, Users, Minus, Plus } from "lucide-react";
import "./Home.css";

export default function HomePage() {
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
    <div className="aquarent-page">
      <header className="header-wrapper">
        <div className="header-content">
          <h1 className="brand-title">AquaRent</h1>
          <div className="icon-group">
            <button className="menu-button" type="button" aria-label="Открыть меню">
              <Menu />
            </button>
            <button className="icon-button" type="button" aria-label="Поиск">
              <Search />
            </button>
            <button className="icon-button" type="button" aria-label="Уведомления">
              <Bell />
            </button>
            <button className="icon-button" type="button" aria-label="Профиль">
              <User />
            </button>
          </div>
        </div>
      </header>

      <section className="map-section">
        <div className="map-container">
          <img
            alt="Карта маршрута"
            className="map-image"
          />
        </div>
      </section>

      <section className="tabs-wrapper">
        <div className="tab-list">
          <button
            type="button"
            onClick={() => setActiveTab("rental")}
            className={`tab-button${activeTab === "rental" ? " tab-button--active" : ""}`}
          >
            Аренда
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("regular")}
            className={`tab-button${activeTab === "regular" ? " tab-button--active" : ""}`}
          >
            Регулярные рейсы
          </button>
        </div>
      </section>

      <section className="form-wrapper">
        <div className="form-card">
          <div className="form-section form-section--two-columns">
            <div className="field">
              <label className="field-label" htmlFor="from">Откуда</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" />
                <input
                  id="from"
                  type="text"
                  className="field-input with-icon"
                  placeholder="Порт отправления"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="to">Куда</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" />
                <input
                  id="to"
                  type="text"
                  className="field-input with-icon"
                  placeholder="Порт прибытия"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-section form-section--date-time">
            <div className="field">
              <label className="field-label" htmlFor="date">Дата</label>
              <div className="input-wrapper">
                <Calendar className="input-icon" />
                <input
                  id="date"
                  type="date"
                  className="field-input with-icon"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="time">Время</label>
              <div className="input-wrapper">
                <Clock className="input-icon" />
                <input
                  id="time"
                  type="time"
                  className="field-input with-icon"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-checkbox">
            <input
              id="return-route"
              type="checkbox"
              className="form-checkbox-input"
              checked={addReturnRoute}
              onChange={(event) => setAddReturnRoute(event.target.checked)}
            />
            <label className="field-label" htmlFor="return-route">
              Добавить обратный маршрут
            </label>
          </div>

          <div className="form-grid-people">
            <div className="field">
              <label className="field-label" htmlFor="adults">Взрослые</label>
              <div className="counter-wrapper">
                <button type="button" className="counter-btn" aria-label="Минус взрослые" onClick={dec(setAdults, adults, 1)}>
                  <Minus size={16} />
                </button>
                <input
                  id="adults"
                  type="number"
                  className="field-input counter-input"
                  value={adults}
                  min={1}
                  readOnly
                />
                <button type="button" className="counter-btn" aria-label="Плюс взрослые" onClick={inc(setAdults, adults)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="children">Дети</label>
              <div className="counter-wrapper">
                <button type="button" className="counter-btn" aria-label="Минус дети" onClick={dec(setChildren, children, 0)}>
                  <Minus size={16} />
                </button>
                <input
                  id="children"
                  type="number"
                  className="field-input counter-input"
                  value={children}
                  min={0}
                  readOnly
                />
                <button type="button" className="counter-btn" aria-label="Плюс дети" onClick={inc(setChildren, children)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="field field--comment">
              <label className="field-label" htmlFor="comment">Комментарий</label>
              <textarea
                id="comment"
                className="field-textarea"
                placeholder="Пожелания по рейсу, дополнительная информация"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="field field--transport">
              <label className="field-label" htmlFor="vehicle-type">Тип ТС</label>
              <div className="input-wrapper">
                <Users className="input-icon" />
                <input
                  id="vehicle-type"
                  type="text"
                  className="field-input with-icon transport-input"
                  placeholder="Катер, теплоход ..."
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="submit-row">
            <button type="button" className="primary-button">
              Найти
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
