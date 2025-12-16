import { useState, useRef } from "react";

import { Modal, Button } from "react-bootstrap";

import styles from "./ProfileImageModal.module.css";

export default function ProfileImageModal({
  show,
  onClose,
  onSave,
  currentImage,
  uploading = false
}) {
  const [preview, setPreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleSave = () => {
    if (inputRef.current?.files[0]) {
      onSave(inputRef.current.files[0]);
    } 
    else if (preview !== currentImage) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          onSave(blob);
        });
      };
      img.src = preview;
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setPreview(currentImage);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Загрузить фото профиля</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className={`${styles["upload-dropzone"]} ${isDragging ? styles["upload-dropzone-active"] : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          style={{ cursor: uploading ? "not-allowed" : "pointer" }}
        >
          <div className={styles["upload-content"]}>
            <div className={styles["upload-icon"]}>📷</div>
            <p className={styles["upload-text"]}>
              {uploading ? "Загрузка..." : "Перетащите фото сюда или кликните, чтобы выбрать"}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className={styles["upload-input"]}
            disabled={uploading}
          />
        </div>

        {preview && (
          <div className={styles["preview-container"]}>
            <img src={preview} alt="Превью" className={styles["preview-image"]} />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={uploading}>
          Отмена
        </Button>
        {preview && (
          <Button variant="danger" onClick={handleRemove} disabled={uploading}>
            Удалить
          </Button>
        )}
        <Button variant="primary" onClick={handleSave} disabled={!preview || uploading}>
          {uploading ? "Загрузка..." : "Сохранить"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}