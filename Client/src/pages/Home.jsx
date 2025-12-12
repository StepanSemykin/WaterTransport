import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

import { User as UserIcon, MapPin, Calendar, Clock, Minus, Plus, Ship, X } from "lucide-react";
import { Button, Modal } from "react-bootstrap";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { useAuth } from "../components/auth/AuthContext.jsx";
import { useSearch } from "../components/search/SearchContext.jsx";

import { apiFetch } from "../api/api.js";

import styles from "./Home.module.css";

const DEFAULT_CENTER = [53.195873, 50.100193];
const DEFAULT_ZOOM = 13;

const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],      
  iconAnchor: [12, 41],    
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function PortsBoundsUpdater({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (!bounds) return;
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, bounds]);

  return null;
}

export default function Home() {
  const navigate = useNavigate();
  const { performSearch, loading: searchLoading, results, locked } = useSearch();
  const { 
    ports = [], portsLoading, 
    shipTypes = [], shipTypesLoading,
    hasActiveOrder, loadActiveOrder,
    role
  } = useAuth();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [addReturnRoute, setAddReturnRoute] = useState(false);
  const [addWalkingTrip, setAddWalkingTrip] = useState(false);
  const [walkDuration, setWalkDuration] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateReturn, setDateReturn] = useState("");
  const [timeReturn, setTimeReturn] = useState("");
  const [showTimeReturnPicker, setShowTimeReturnPicker] = useState(false);

  const [numPeople, setNumPeople] = useState(1);
  const [comment, setComment] = useState("");
  const [fromPortId, setFromPortId] = useState("");
  const [toPortId, setToPortId] = useState("");
  const [shipTypeId, setShipTypeId] = useState("");
  const [portsError, setPortsError] = useState("");

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const [rentOrderResponse, setRentOrderResponse] = useState(null);

  const clearDate = () => setDate("");
  const clearTime = () => setTime("");
  const clearDateReturn = () => setDateReturn("");
  const clearTimeReturn = () => setTimeReturn("");
  const clearWalkDuration = () => setWalkDuration("");

  const openError = (title, message) => {
    setErrorTitle(title || "Ошибка");
    setErrorMessage(message || "Произошла ошибка");
    setShowErrorModal(true);
  };

  const availablePorts = Array.isArray(ports) ? ports : [];
  const availableShipTypes = Array.isArray(shipTypes) ? shipTypes : [];

  const filteredFromPorts = availablePorts.filter(port => 
    port.title.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToPorts = availablePorts.filter(port => 
    port.title.toLowerCase().includes(toSearch.toLowerCase())
  );

  const dec = (setter, value, min = 0) => () => setter(value > min ? value - 1 : min);
  const inc = (setter, value, max = 99) => () => setter(value < max ? value + 1 : max);

  useEffect(() => {
    loadActiveOrder(role);
  }, [role]);

  const canOpenResults = hasActiveOrder;

  const geoPorts = useMemo(() => {
    return ports
      .map((port) => {
        const latitude = Number.parseFloat(port?.latitude);
        const longitude = Number.parseFloat(port?.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }

        return { ...port, latitude, longitude };
      })
      .filter(Boolean);
  }, [ports]);

  const mapBounds = useMemo(() => {
    if (!geoPorts.length) return null;

    const latitudes = geoPorts.map((port) => port.latitude);
    const longitudes = geoPorts.map((port) => port.longitude);

    return [
      [Math.min(...latitudes), Math.min(...longitudes)],
      [Math.max(...latitudes), Math.max(...longitudes)],
    ];
  }, [geoPorts]);

  const mapStatus = useMemo(() => {
    if (portsLoading) return "Загружаем данные портов...";
    if (portsError) return portsError;
    if (!geoPorts.length) return "Порты не найдены";
    return "";
  }, [geoPorts.length, portsError, portsLoading]);
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSearchClick(e) {
    e?.preventDefault?.();
    
    if (searchLoading) {
      return; 
    }

    if (locked) {
      openError("Активная заявка", "У вас уже есть активная заявка. Подтвердите её или отмените на странице результатов.");
      return;
    }

    if (!fromPortId || (!addWalkingTrip && !toPortId) || !date || !time || (addWalkingTrip && !walkDuration) || shipTypeId === "") {
      openError("Проверьте поля", "Пожалуйста, заполните все обязательные поля");
      return;
    }

    const payload = {
      fromPortId,
      toPortId: addWalkingTrip ? null : toPortId,
      date,
      time,
      numPeople,
      comment: comment?.trim() || null,
      shipTypeId: shipTypeId || null,
      walkDuration: addWalkingTrip ? walkDuration : null 
    };
    
    console.log('Поля формы:', payload );

    const localDate = new Date(`${payload.date}T${payload.time}`);
    const isoString = localDate.toISOString();

    try {
      await performSearch(payload); // запрос к серверу + сохранение результатов в контекст
      navigate("/results"); // если хотите авто-переход — раскомментируйте:
      const res = await apiFetch("/api/RentOrders", {
        method: "POST",
        body: JSON.stringify({
          ShipTypeId: payload.shipTypeId,
          departurePortId: payload.fromPortId,
          arrivalPortId: payload.toPortId,
          numberOfPassengers: payload.numPeople,
          rentalStartTime: isoString,
          duration: payload.walkDuration
        }),
      });

      let data = null;
      if (res?.ok) {
        data = await res.json().catch(() => null);
      }
      setRentOrderResponse(data);
      // const newId = data?.id ?? data?.Id ?? null;
      // if (newId) {
      //   sessionStorage.setItem("currentRentOrderId", String(newId));
      //   sessionStorage.setItem("canOpenResults", "1");
      // }
      console.log("RentOrder response:", data);
    } 
    catch (e) {
      openError("Ошибка поиска", e?.message || "Не удалось выполнить поиск");
    }
    finally {
    }
  }

  const formatDateLocal = (d) => {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const formatTimeToString = (d) => {
    if (!d) return "";
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  return (
    <div className={styles["aquarent-page"]}>

      <Modal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{errorTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <div className={styles["modal-footer"]}>
          <button
            type="button"
            className={styles["primary-button"]}
            onClick={() => setShowErrorModal(false)}
          >
            ОК
          </button>
        </div>
      </Modal>
      
      <header className={styles["header-wrapper"]}>
        <div className={styles["header-content"]}>
          <h1 className={styles["brand-title"]}>AquaRent</h1>
          <div className={styles["icon-group"]}>
            {/* <Button 
              variant="light" 
              className={styles["notices-icon-button"]} 
              aria-label="Уведомления"
            >
              <Bell className={styles["notices-icon"]} />
            </Button> */}
            <Button 
              variant="light" 
              onClick={() => navigate("/user")}
              className={styles["user-icon-button"]} 
              aria-label="Профиль"
            >
              <UserIcon className={styles["user-icon"]}/>
            </Button>
          </div>
        </div>
      </header>

      <section className={styles["map-section"]}>
        <div className={styles["map-container"]}>
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom
            className={styles["map"]}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {mapBounds && <PortsBoundsUpdater bounds={mapBounds} />}

            {geoPorts.map((port) => (
              <Marker
                key={port.id ?? `${port.latitude}-${port.longitude}`}
                position={[port.latitude, port.longitude]}
                icon={defaultIcon}
              >
                <Popup>
                  <strong>{port.title ?? "Порт"}</strong>
                  {port.address ? <div>{port.address}</div> : null}
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {mapStatus ? <div className={styles["map-status"]}>{mapStatus}</div> : null}
        </div>
      </section>

      <section className={styles["form-wrapper"]}>
        <div className={styles["form-card"]}>
          <div className={`${styles["form-section"]} ${styles["form-section-two-col"]}`}>
            <div className={styles["field"]} ref={fromDropdownRef}>
              <label className={styles["field-label"]} htmlFor="from">Откуда</label>
              <div className={styles["input-wrapper"]}>
                <MapPin className={styles["input-icon"]} />
                <input
                  id="from"
                  type="text"
                  className={`${styles["field-input"]} ${styles["with-icon"]}`}
                  placeholder="Введите пристань отправления"
                  value={fromSearch}
                  onChange={(e) => {
                    setFromSearch(e.target.value);
                    setShowFromDropdown(true);
                  }}
                  onFocus={() => setShowFromDropdown(true)}
                />
                {fromSearch && showFromDropdown && filteredFromPorts.length > 0 && (
                  <ul className={styles["dropdown-list"]}>
                    {filteredFromPorts.map((port) => (
                      <li 
                        className={styles["dropdown-item"]}
                        key={port.id} 
                        onClick={() => {
                          setFromPortId(port.id);
                          setFromSearch(port.title || port.name);
                          setShowFromDropdown(false);
                        }}>
                        {port.title || port.name}
                      </li>
                    ))}
                  </ul>
                )}
                {fromSearch && (
                  <button 
                    type="button"
                    onClick={() => {
                      setFromSearch("");
                      setFromPortId("");
                      setShowFromDropdown(false);
                      }} 
                    className={styles["clear-button"]}
                    aria-label="Очистить пристань отправления"
                  >
                    <X />
                  </button>
                )}
              </div>
            </div>

            {!addWalkingTrip ? (
              <div className={styles["field"]} ref={toDropdownRef}>
                <label className={styles["field-label"]} htmlFor="to">Куда</label>
                <div className={styles["input-wrapper"]}>
                  <MapPin className={styles["input-icon"]} />
                  <input
                    id="to"
                    type="text"
                    className={`${styles["field-input"]} ${styles["with-icon"]}`}
                    placeholder="Введите пристань прибытия"
                    value={toSearch}
                    onChange={(e) => {
                      setToSearch(e.target.value);
                      setShowToDropdown(true);
                    }}
                    onFocus={() => setShowToDropdown(true)}
                  />
                  {toSearch && showToDropdown && filteredToPorts.length > 0 && (
                    <ul className={styles["dropdown-list"]}>
                      {filteredToPorts.map((port) => (
                        <li 
                          className={styles["dropdown-item"]}
                          key={port.id} 
                          onClick={() => {
                            setToPortId(port.id);
                            setToSearch(port.title || port.name);
                            setShowToDropdown(false);
                          }}>
                          {port.title || port.name}
                        </li>
                      ))}
                    </ul>
                  )}
                  {toSearch && (
                    <button 
                      type="button"
                      onClick={() => {
                        setToSearch("");
                        setToPortId("");
                        setShowToDropdown(false);
                        }} 
                      className={styles["clear-button"]}
                      aria-label="Очистить пристань прибытия"
                    >
                      <X />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles["field"]}>
                <label className={styles["field-label"]} htmlFor="walk-duration">Длительность прогулки</label>
                <div className={styles["input-wrapper"]}>
                  <Clock className={styles["input-icon"]} />
                  <input
                    id="walk-duration"
                    type="time"
                    className={`${styles["field-input"]} ${styles["with-icon"]}`}
                    placeholder="Например: 2 часа, 30 минут"
                    value={walkDuration}
                    onChange={(e) => setWalkDuration(e.target.value)}
                  />
                  {walkDuration && (
                  <button 
                    type="button"
                    onClick={clearWalkDuration}
                    className={styles["clear-time-button"]}
                    aria-label="Очистить длительность прогулки"
                  >
                    <X />
                  </button>
                )}
                </div>
              </div>
            )}
          </div>

          <div className={styles["form-checkbox"]}>
            <input
              id="walk-route"
              type="checkbox"
              className={styles["form-checkbox-input"]}
              checked={addWalkingTrip}
              onChange={(event) => setAddWalkingTrip(event.target.checked)}
            />
            <label className={styles["field-label"]} htmlFor="return-route">
              Прогулочная поездка
            </label>
          </div>

          <div className={`${styles["form-section"]} ${styles["form-section-date-time"]}`}>
            <div className={styles["field"]}>
              <label className={styles["field-label"]} htmlFor="date">Дата</label>
              <div className={`${styles["input-wrapper"]} ${styles["datepicker-wrapper"]}`}>
                <Calendar className={styles["input-icon"]} />
                <DatePicker
                  id="date"
                  selected={date ? new Date(date) : null}
                  onChange={(d) => setDate(formatDateLocal(d))}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Выберите дату"
                  className={`${styles["field-input"]} ${styles["with-icon"]}`}
                  closeOnScroll
                  minDate={new Date()}
                  filterDate={(d) => d >= new Date()}
                />
                {date && (
                  <button 
                    type="button"
                    onClick={clearDate}
                    className={styles["clear-date-button"]}
                    aria-label="Очистить дату поездки"
                  >
                    <X />
                  </button>
                )}
              </div>
            </div>
            <div className={styles["field"]}>
              <label className={styles["field-label"]} htmlFor="time">Время</label>
              <div className={`${styles["input-wrapper"]} ${styles["timepicker-wrapper"]}`}>
                <Clock className={styles["input-icon"]} />
                <input
                  id="time"
                  type="time"
                  className={`${styles["field-input"]} ${styles["with-icon"]}`}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                /> 
                {time && (
                  <button 
                    type="button"
                    onClick={clearTime}
                    className={styles["clear-time-button"]}
                    aria-label="Очистить время поездки"
                  >
                    <X />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* <div className={styles["form-checkbox"]}>
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

          {addReturnRoute && (
            <div className={`${styles["form-section"]} ${styles["form-section-date-time"]}`}>
              <div className={styles["field"]}>
                <label className={styles["field-label"]} htmlFor="date">Дата обратной поездки</label>
                <div className={`${styles["input-wrapper"]} ${styles["datepicker-wrapper"]}`}>
                  <Calendar className={styles["input-icon"]} />
                  <DatePicker
                    id="dateReturn"
                    selected={dateReturn ? new Date(dateReturn) : null}
                    onChange={(d) => setDateReturn(formatDateLocal(d))}
                    dateFormat="dd.MM.yyyy"
                    placeholderText="Выберите дату"
                    className={`${styles["field-input"]} ${styles["with-icon"]}`}
                    closeOnScroll
                    minDate={new Date()}
                    filterDate={(d) => d >= new Date()}
                  />
                  {dateReturn && (
                    <button 
                      type="button"
                      onClick={clearDateReturn}
                      className={styles["clear-date-button"]}
                      aria-label="Очистить дату обратной поездки"
                    >
                      <X />
                    </button>
                  )}
                </div>
              </div>
              <div className={styles["field"]}>
                <label className={styles["field-label"]} htmlFor="time">Время обратной поездки</label>
                <div className={styles["input-wrapper"]}>
                  <Clock className={styles["input-icon"]} />
                  <input
                    id="time"
                    type="time"
                    className={`${styles["field-input"]} ${styles["with-icon"]}`}
                    value={timeReturn}
                    onChange={(e) => setTimeReturn(e.target.value)}
                  />
                  {timeReturn && (
                    <button 
                      type="button"
                      onClick={clearTimeReturn}
                      className={styles["clear-time-button"]}
                      aria-label="Очистить время обратной поездки"
                    >
                      <X />
                    </button>
                  )}
                </div>
              </div>
            </div>  
          )}     */}
          
          <div className={styles["form-grid-people"]}>
            <div className={styles["field"]}>
              <label className={styles["field-label"]} htmlFor="numPeople">Всего человек</label>
              <div className={styles["counter-wrapper"]}>
                <button 
                  type="button" 
                  className={styles["counter-btn"]} 
                  aria-label="Минус взрослые" 
                  onClick={dec(setNumPeople, numPeople, 1)}>
                  <Minus size={16} />
                </button>
                <input
                  id="numPeople"
                  type="number"
                  className={`${styles["field-input"]} ${styles["counter-input"]}`}
                  value={numPeople}
                  min={1}
                  max={99}
                  readOnly
                />
                <button 
                  type="button" 
                  className={styles["counter-btn"]} 
                  aria-label="Плюс взрослые" 
                  onClick={inc(setNumPeople, numPeople)}>
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
            <div className={`${styles["field"]} ${styles["field-transport"]}`}>
              <label className={styles["field-label"]} htmlFor="vehicle-type">Тип судна</label>
              <div className={styles["input-wrapper"]}>
                <Ship className={styles["input-icon"]} />
                <select
                  id="shipType"
                  value={shipTypeId}
                  onChange={(e) => setShipTypeId(e.target.value)}
                  className={`${styles["field-input"]} ${styles["with-icon"]} ${styles["transport-input"]}`}
                  disabled={shipTypesLoading}
                >
                  <option value="">{shipTypesLoading ? "Загрузка типов..." : "Выберите тип судна"}</option>
                  {availableShipTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title || t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles["submit-row"]}>
            <form className={styles["search-form"]} onSubmit={handleSearchClick}>
              <div className={styles["actions-row"]}>
                <button
                  type="submit"
                  className={styles["primary-button"]}
                  disabled={portsLoading || searchLoading /* + ваша валидация */}
                  aria-busy={searchLoading}
                >
                  {searchLoading ? "Ищем..." : "Найти"}
                </button>

                <button
                  type="button"
                  className={styles["secondary-button"]}
                  onClick={() => navigate("/offerresults")}
                  disabled={!canOpenResults}
                  title={canOpenResults ? "Перейти к результатам" : "Сначала выполните поиск"}
                >
                  К результатам
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    
    </div>
  );
}
