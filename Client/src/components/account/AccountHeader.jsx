import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Container } from "react-bootstrap";
import { LogOut as LogOutIcon, Home, Plus } from "lucide-react";

import LogOut from "../auth/LogOut.jsx";
import ProfileImageModal from "./ProfileImageModal.jsx";
import { apiFetchRaw } from "../../api/api.js";

import styles from "./AccountHeader.module.css"

const USER_IMAGES_ENDPOINT = "/api/userimages";

export function AccountHeader({ 
  firstName, 
  lastName, 
  email, 
  location, 
  profileImage,
  userId,
  isPartner = false
}) {

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(profileImage);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(profileImage);
  }, [profileImage]);

  const handleSave = async (file) => {
    if (!userId || !file) {
      console.error("User ID and file are required");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("Image", file);
      formData.append("UserId", userId);
      formData.append("IsPrimary", "true");

      const res = await apiFetchRaw(USER_IMAGES_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Ошибка ${res.status}: не удалось загрузить изображение`);
      }

      const data = await res.json();
      const imageUrl = data?.url || data?.imageUrl || data?.path;
      
      if (imageUrl) {
        setPreview(imageUrl);
      } 
      else {
        setPreview(URL.createObjectURL(file));
      }

      setShowModal(false);
    } 
    catch (err) {
      console.error("Failed to upload profile image:", err);
      alert(err.message || "Не удалось загрузить изображение");
    } 
    finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["user-header"]}>
        <Container className={styles["user-topbar"]}>
          <div className={styles["user-profile"]}>
            <div className={styles["user-avatar-wrapper"]}>
              {preview ? (
                <img 
                  src={preview} 
                  alt={`${firstName} ${lastName}`}
                  className={styles["user-avatar-image"]}
                />
              ) : (
                <div className={styles["user-avatar"]}>
                  <span className={styles["user-avatar-text"]}>
                    {`${firstName?.[0] || ""}${lastName?.[0] || ""}`}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className={styles["user-avatar-upload"]}
                aria-label="Загрузить фото профиля"
                disabled={uploading}
              >
                <Plus size={16} />
              </button>
            </div>

            <div>
              <h1 className={styles["user-name"]}>{`${firstName} ${lastName}`}</h1>
              <p className={styles["user-email"]}>{email}</p>
              <p className={styles["user-registered"]}>{location}</p>
            </div>
          </div>

          <div className={styles["user-actions"]}>
            {!isPartner && (
             <Button 
              variant="light" 
              onClick={() => navigate("/")}
              className={styles["user-icon-button"]}
            >
              <Home className={styles["user-icon"]} />
            </Button> 
            )}

            <LogOut
              variant="light"
              className={styles["user-icon-button"]}
              ariaLabel="Выход из аккаунта"
              icon={<LogOutIcon className={styles["user-icon"]} />}
            />
          </div>
        </Container>
      </div>

      <ProfileImageModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        currentImage={preview}
        uploading={uploading}
      />
    </div>
  );
}