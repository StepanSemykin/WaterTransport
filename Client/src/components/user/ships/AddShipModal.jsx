import { useState, useEffect, useRef } from "react";

import { Button } from "react-bootstrap";
import { X, MapPin } from "lucide-react";

import { useAuth } from "../../auth/AuthContext.jsx";
import { apiFetch, apiFetchRaw } from "../../../api/api.js";

import ErrorModal from "../../error/ErrorModal.jsx";

import styles from "./AddShipModal.module.css";

const initialFormData = {
  name: "",
  shipTypeId: "",
  capacity: "",
  registrationNumber: "",
  yearOfManufacture: "",
  maxSpeed: "",
  width: "",
  length: "",
  description: "",
  costPerHour: "",
  imageFile: null,
  portId: "",
};

const SHIPS_ENDPOINT = "/api/Ships";
const SHIP_IMAGES_ENDPOINT = "/api/shipimages";

export function AddShipModal({ isOpen, onClose, onSave }) {
  const { ports = [], portsLoading, shipTypes = [], shipTypesLoading, user } = useAuth();

  const [errorModal, setErrorModal] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const [portSearch, setPortSearch] = useState("");
  const [showPortDropdown, setShowPortDropdown] = useState(false);
  const portDropdownRef = useRef(null);

  const availablePorts = Array.isArray(ports) ? ports : [];
  const availableShipTypes = Array.isArray(shipTypes) ? shipTypes : [];

  const filteredPorts = availablePorts.filter(port =>
    (port.title || port.name || "").toLowerCase().includes(portSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (portDropdownRef.current && !portDropdownRef.current.contains(event.target)) {
        setShowPortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.phone) {
      setFormData(prev => ({ ...prev, userPhone: user.phone }));
    }
  }, [user]);

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFormData(initialFormData);
    setPortSearch("");
    setShowPortDropdown(false);
    setIsDragging(false);
    if (inputRef.current) {
      try { inputRef.current.value = ""; } 
      catch {}
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFile = (file) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, imageFile: file }));
    } 
    else {
      setPreviewUrl(null);
      setFormData(prev => ({ ...prev, imageFile: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files && files[0] ? files[0] : null;
      handleFile(file);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0] ? e.dataTransfer.files[0] : null;
    if (file) handleFile(file);
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFormData(prev => ({ ...prev, imageFile: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.portId) {
      setErrorModal({
        message: "Не выбрана пристань"
      });
      return;
    }

    const selectedPort = availablePorts.find(p => p.id === formData.portId);
    if (!selectedPort) {
      setErrorModal({
        message: "Пристань не найдена"
      });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        shipTypeId: Number(formData.shipTypeId),
        capacity: Number(formData.capacity),
        registrationNumber: formData.registrationNumber || "",
        yearOfManufacture: formData.yearOfManufacture
          ? new Date(Number(formData.yearOfManufacture), 0, 1).toISOString()
          : null,
        maxSpeed: formData.maxSpeed ? Number(formData.maxSpeed) : null,
        width: formData.width ? Number(formData.width) : null,
        length: formData.length ? Number(formData.length) : null,
        description: formData.description || null,
        costPerHour: formData.costPerHour ? Number(formData.costPerHour) : null,
        portId: selectedPort.id ? selectedPort.id : null,
        userId: user.id ? user.id : null,
      };

      const shipRes = await apiFetch(SHIPS_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!shipRes.ok) {
        const txt = await shipRes.text();
        let errMsg = txt;
        errMsg = JSON.parse(txt)?.detail || errMsg;
        setErrorModal({
          message: errMsg
        });
        return;
      }

      const createdShip = await shipRes.json();
      const shipId = createdShip.id;

      if (formData.imageFile && shipId) {
        const form = new FormData();
        form.append("ShipId", shipId);
        form.append("Image", formData.imageFile);
        form.append("IsPrimary", "true");

        const imgRes = await apiFetchRaw(SHIP_IMAGES_ENDPOINT, {
          method: "POST",
          body: form,
        });

        if (!imgRes.ok) {
          setErrorModal({
            message: "Судно создано, но не удалось загрузить фото"
          });
        }
      }
      onSave && onSave(createdShip);
      onClose();
    } 
    catch (err) {
      setErrorModal({
        message: "Произошла сетевая ошибка при создании судна"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles["modal-container"]} 
      onClick={() => {
        if (!errorModal) onClose && onClose();
      }}
    >
      <div className={styles["modal-content"]} onClick={e => e.stopPropagation()}>
        <div className={styles["modal-header"]}>
          <h2 className={styles["modal-title"]}>Добавить судно</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles["modal-body"]}>
            <div className={styles["form-section"]}>
              <h3 className={styles["section-title"]}>Основная информация</h3>
              <div className={styles["form-grid"]}>
                <div className={styles["form-field"]}>
                  <label className={styles["form-label"]}>Название</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles["form-input"]}
                    placeholder="Введите название судна"
                    required
                  />
                </div>

                <div className={styles["form-field"]}>
                  <label className={styles["form-label"]}>Тип</label>
                  <select
                    name="shipTypeId"
                    value={formData.shipTypeId}
                    onChange={handleChange}
                    className={`${styles["form-input"]} ${styles["form-input-ship-type"]}`}
                    required
                    disabled={shipTypesLoading}
                  >
                    <option value="">{shipTypesLoading ? "Загрузка типов..." : "Выберите тип"}</option>
                    {availableShipTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.title || type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles["form-field"]}>
                  <label className={styles["form-label"]}>Вместимость</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className={styles["form-input"]}
                    placeholder="Количество человек"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className={styles["form-field"]}>
                <label className={styles["form-label"]}>Описание</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles["form-textarea"]}
                  placeholder="Описание судна, особенности, удобства"
                />
              </div>

              <div className={styles["form-field"]}>
                <label className={styles["form-label"]}>Фото</label>

                <div
                  className={`${styles["dropzone"]} ${isDragging ? styles["dropzone-active"] : ""}`}
                  onClick={() => inputRef.current && inputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                >
                  {!previewUrl ? (
                    <div className={styles["dropzone-content"]}>
                      <div className={styles["drop-icon"]}>📷</div>
                      <div className={styles["drop-text"]}>Перетащите фото сюда или кликните, чтобы выбрать</div>
                    </div>
                  ) : (
                    <div className={styles["image-preview-wrapper"]}>
                      <img
                        src={previewUrl}
                        alt="Предпросмотр"
                        className={styles["image-preview"]}
                      />
                      <div className={styles["preview-actions"]}>
                        <button type="button" onClick={handleRemoveImage} className={styles["button"]}>
                          Удалить фото
                        </button>
                      </div>
                    </div>
                  )}

                  <input
                    ref={inputRef}
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>

            <div className={styles["form-section"]}>
              <h3 className={styles["section-title"]}>Технические характеристики</h3>
              <div className={styles["form-row"]}>
                <div className={styles["form-field"]}>
                  <label className={styles["form-label"]}>Длина</label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    className={styles["form-input"]}
                    placeholder="м"
                    step="0.1"
                    min="0"
                  />
                </div>

                <div className={styles["form-field"]}>
                  <label className={styles["form-label"]}>Ширина</label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    className={styles["form-input"]}
                    placeholder="м"
                    step="0.1"
                    min="0"
                  />
                </div>

                <div className={styles["form-field"]}>
                  <label className={styles["form-label"]}>Год выпуска</label>
                  <input
                    type="number"
                    name="yearOfManufacture"
                    value={formData.yearOfManufacture}
                    onChange={handleChange}
                    className={styles["form-input"]}
                    placeholder="гггг"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className={styles["form-field"]}>
                  <label className={styles["form-label"]}>Скорость</label>
                  <input
                    type="number"
                    name="maxSpeed"
                    value={formData.maxSpeed}
                    onChange={handleChange}
                    className={styles["form-input"]}
                    placeholder="км/ч"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className={styles["form-row-fullwidth"]}>
              <div className={styles["form-field-fullwidth"]}>
                <label className={styles["form-label"]}>Регистрационный номер</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className={styles["form-input"]}
                  placeholder="Введите регистрационный номер"
                />
              </div>
            </div>

            <div className={styles["form-section"]}>
              <h3 className={styles["section-title"]}>Ценообразование</h3>
              <div className={styles["price-options"]}>
                <div className={styles["form-field"]}>
                  <label className={styles["form-label"]}>Цена за час</label>
                  <input
                    type="number"
                    name="costPerHour"
                    value={formData.costPerHour}
                    onChange={handleChange}
                    className={styles["form-input"]}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles["form-section"]}>
              <h3 className={styles["section-title"]}>Пристань</h3>
              <div className={styles["port-options"]}>
                <div className={styles["form-field"]} ref={portDropdownRef}>
                  <label className={styles["form-label"]}>Пристань, к которой привязано судно</label>
                  <div className={styles["input-wrapper"]}>
                    <MapPin className={styles["input-icon"]} />
                    <input
                      type="text"
                      className={`${styles["form-input"]} ${styles["form-input-port"]} ${styles["with-icon"]} ${portSearch ? styles["with-clear"] : ""}`}
                      placeholder={portsLoading ? "Загрузка пристаней..." : "Введите название пристани"}
                      value={portSearch}
                      onChange={(e) => {
                        setPortSearch(e.target.value);
                        setShowPortDropdown(true);
                      }}
                      onFocus={() => setShowPortDropdown(true)}
                      disabled={portsLoading}
                      required
                    />
                    {portSearch && (
                      <button
                        type="button"
                        className={styles["clear-button"]}
                        onClick={() => {
                          setPortSearch("");
                          setFormData(prev => ({ ...prev, portId: "" }));
                          setShowPortDropdown(false);
                        }}
                        aria-label="Очистить"
                      >
                        <X />
                      </button>
                    )}
                    {portSearch && showPortDropdown && filteredPorts.length > 0 && (
                      <ul className={styles["dropdown-list"]}>
                        {filteredPorts.map((port) => (
                          <li
                            key={port.id}
                            className={styles["dropdown-item"]}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, portId: port.id }));
                              setPortSearch(port.title || port.name);
                              setShowPortDropdown(false);
                            }}
                          >
                            {port.title || port.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className={styles["modal-footer"]}>
            <Button
              variant="outline-secondary"
              onClick={() => {
                if (!errorModal) onClose && onClose();
              }}
            >
              Отмена
            </Button>
            <Button
              type="submit" 
              variant="primary"
            >
              Добавить судно
            </Button>
          </div>
        </form>
      </div>

      <ErrorModal
       show={Boolean(errorModal)}
       onClose={() => setErrorModal(null)}
       title="Ошибка при добавлении судна"
       message={errorModal?.message}
     />

    </div>
  );
}