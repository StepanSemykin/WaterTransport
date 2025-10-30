import { useState, useEffect, useRef } from "react";

import styles from "./AddShip.module.css";

const SHIP_TYPES = [
  { value: "катер", label: "Катер" },
  { value: "теплоход", label: "Теплоход" },
  { value: "яхта", label: "Яхта" },
  { value: "лодка", label: "Лодка" },
  { value: "катамаран", label: "Катамаран" }
];

const initialFormData = {
  name: "",
  type: "",
  capacity: "",
  description: "",
  pricingType: "hour",
  price: "",
  length: "",
  width: "",
  speed: "",
  year: "",
  isActive: true,
  registrationNumber: "",
  imageFile: null
};

export function AddShip({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(initialFormData);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFormData(initialFormData);
    setIsDragging(false);
    if (inputRef.current) {
      try { inputRef.current.value = ""; } catch {}
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles["modal-container"]} onClick={onClose}>
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
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={styles["form-select"]}
                    required
                  >
                    <option value="">Выберите тип</option>
                    {SHIP_TYPES.map((shipType) => (
                      <option key={shipType.value} value={shipType.value}>
                        {shipType.label}
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

              <div className={styles["form-field"]} style={{ marginTop: 16 }}>
                <label className={styles["form-label"]}>Описание</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles["form-textarea"]}
                  placeholder="Описание судна, особенности, удобства"
                />
              </div>

              <div className={styles["form-field"]} style={{ marginTop: 12 }}>
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
                    name="year"
                    value={formData.year}
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
                    name="speed"
                    value={formData.speed}
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
                    name="price"
                    value={formData.price}
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
                <div className={styles["form-field"]}>
                  <label className={styles["form-label"]}>Пристань, к которой привязано судно</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={styles["form-input"]}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles["switch-container"]}>
              <span className={styles["switch-label"]}>Судно активно</span>
              <label className={styles["switch"]}>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span className={styles["slider"]}></span>
              </label>
            </div>
          </div>

          <div className={styles["modal-footer"]}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles["button"]} ${styles["button-secondary"]}`}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={`${styles["button"]} ${styles["button-primary"]}`}
            >
              Добавить судно
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}