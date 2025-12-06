import { useState, useEffect, useRef } from "react";

import { Button } from "react-bootstrap";
import { X, MapPin, Edit, DollarSign, Calendar, Trash2 } from "lucide-react";

import { useAuth } from "../../auth/AuthContext";

import { apiFetch, apiFetchRaw } from "../../../api/api.js";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal.jsx";

import styles from "./EditShipModal.module.css";

const SHIPS_ENDPOINT = "/api/Ships";
const SHIP_IMAGES_ENDPOINT = "/api/shipimages";

export function EditShipModal({ isOpen, onClose, ship, onSave }) {
  const { ports = [], portsLoading, shipTypes = [], shipTypesLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("edit");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
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
  });

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
    if (ship && isOpen) {    
      const port = availablePorts.find(p => p.id === ship.portId);
      const portTitle = port.title;

      console.log("Инициализация пристани:", portTitle);
      setPortSearch(portTitle);

      const yearValue = ship.yearOfManufacture 
        ? new Date(ship.yearOfManufacture).getFullYear()
        : "";

      setFormData({
        name: ship.name || "",
        shipTypeId: ship.shipTypeId || "",
        capacity: ship.capacity || "",
        registrationNumber: ship.registrationNumber || "",
        yearOfManufacture: yearValue,
        maxSpeed: ship.maxSpeed || "",
        width: ship.width || "",
        length: ship.length || "",
        description: ship.description || "",
        costPerHour: ship.costPerHour || "",
        imageFile: null,
        portId: ship.portId || ship.port?.id || "",
      });

      if (ship.primaryImage?.url || ship.images?.[0]?.url) {
        setPreviewUrl(ship.primaryImage?.url || ship.images?.[0]?.url);
      }
    }
  }, [ship, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab("edit");
      setPortSearch("");
      setShowPortDropdown(false);
      setIsDragging(false);
      if (previewUrl && formData.imageFile) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl && formData.imageFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, formData.imageFile]);

  const handleFile = (file) => {
    if (previewUrl && formData.imageFile) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, imageFile: file }));
    } 
    else {
      setPreviewUrl(ship?.primaryImage?.url || ship?.images?.[0]?.url || null);
      setFormData(prev => ({ ...prev, imageFile: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files && files[0] ? files[0] : null;
      handleFile(file);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
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
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemoveImage = () => {
    if (previewUrl && formData.imageFile) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(ship?.primaryImage?.url || ship?.images?.[0]?.url || null);
    setFormData(prev => ({ ...prev, imageFile: null }));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await apiFetch(`${SHIPS_ENDPOINT}/${ship.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to delete ship:", text);
        alert(`Ошибка при удалении судна: ${text || res.status}`);
        return;
      }

      onSave && onSave(null);
      setShowDeleteConfirm(false);
      onClose();
    } 
    catch (err) {
      console.error("Error while deleting ship:", err);
      alert("Произошла сетевая ошибка при удалении судна");
    } 
    finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.portId) {
      alert("Не выбрана пристань");
      return;
    }

    const selectedPort = availablePorts.find(p => p.id === formData.portId);
    if (!selectedPort) {
      alert("Пристань не найдена");
      return;
    }

    try {
      const payload = {
        id: ship.id,
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
        portId: selectedPort.id ? selectedPort.id : null
      };

      const shipRes = await apiFetch(`${SHIPS_ENDPOINT}/${ship.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!shipRes.ok) {
        const text = await shipRes.text();
        console.error("Failed to update ship:", text);
        alert(`Ошибка при обновлении судна: ${text || shipRes.status}`);
        return;
      }

      const updatedShip = await shipRes.json();

      // Если выбрано новое изображение, загружаем его
      if (formData.imageFile) {
        const form = new FormData();
        form.append("ShipName", updatedShip.name);
        form.append("Image", formData.imageFile);
        form.append("IsPrimary", "true");

        const imgRes = await apiFetchRaw(`${SHIP_IMAGES_ENDPOINT}/${ship.id}`, {
          method: "PUT",
          body: form,
        });

        if (!imgRes.ok) {
          const txt = await imgRes.text();
          console.error("Failed to upload ship image:", txt);
          alert(`Судно обновлено, но не удалось загрузить новое фото: ${txt || imgRes.status}`);
        }
      }

      onSave && onSave(updatedShip); 
      onClose();
    } 
    catch (err) {
      console.error("Error while updating ship:", err);
      alert("Произошла сетевая ошибка при обновлении судна");
    }
  };

  if (!isOpen || !ship) return null;

  const tabs = [
    { id: "edit", label: "Редактирование", icon: Edit },
    { id: "pricing", label: "Ценообразование", icon: DollarSign },
    { id: "calendar", label: "Календарь доступности", icon: Calendar },
  ];

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-container"]} onClick={onClose}>
        <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
          <div className={styles["modal-header"]}>
            <h2 className={styles["modal-title"]}>{ship.name || "Редактирование судна"}</h2>
            <button
              type="button"
              className={styles["close-button"]}
              onClick={onClose}
              aria-label="Закрыть"
            >
              <X size={24} />
            </button>
          </div>

          <div className={styles["tabs-container"]}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles["tab-button"]} ${activeTab === tab.id ? styles["tab-active"] : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles["modal-body"]}>
              {activeTab === "edit" && (
                <div className={styles["tab-content"]}>
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
                          className={styles["form-select"]}
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
                        onClick={() => inputRef.current?.click()}
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
                                {formData.imageFile ? "Удалить новое фото" : "Изменить фото"}
                              </button>
                            </div>
                          </div>
                        )}

                        <input
                          ref={inputRef}
                          type="file"
                          name="imageFile"
                          className={styles["input-ref"]}
                          accept="image/*"
                          onChange={handleChange}
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
                      <div className={styles["form-field-fullwidth"]} ref={portDropdownRef}>
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
              )}

              {activeTab === "pricing" && (
                <div className={styles["tab-content"]}>
                  <div className={styles["form-section"]}>
                    <h3 className={styles["section-title"]}>Ценообразование</h3>
                    <p className={styles["placeholder-text"]}>
                      Настройки цен будут добавлены позже
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "calendar" && (
                <div className={styles["tab-content"]}>
                  <div className={styles["form-section"]}>
                    <h3 className={styles["section-title"]}>Календарь доступности</h3>
                    <p className={styles["placeholder-text"]}>
                      Календарь будет добавлен позже
                    </p>
                  </div>
                </div>
              )}
            </div>

           <div className={styles["footer"]}>
              <div className={styles["group"]}>
                <Button
                  type="submit" 
                  variant="primary"
                  disabled={isDeleting}
                >
                  Сохранить изменения
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                >
                  <Trash2 size={18} className="me-1" />
                  Удалить
                </Button>
              </div>
              <div className={styles["group"]}>
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={isDeleting}
                >
                  Отмена
                </Button>
              </div>  
            </div>
          </form>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        shipName={ship?.name || ""}
        isDeleting={isDeleting}
      />        

    </div>
  );
}