import { useState } from "react";

import { ArrowLeft } from "lucide-react";

import Statistics from "../components/support/SupportStats.jsx";
import Appeals from "../components/support/SupportAppeals.jsx";

import styles from "./Support.module.css";

export default function Support() {
  const [activeTab, setActiveTab] = useState("appeals");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles["support-page"]}>
      <header className={styles["support-header"]}>
        <div className={styles["header-container"]}>
          <div className={styles["header-row"]}>
            <div className={styles["header-start"]}>
              <button className={styles["back-button"]}>
                <ArrowLeft className={styles["icon-sm"]} />
              </button>
              <div className={styles["header-titles"]}>
                <h1>Служба поддержки</h1>
                <p>Центр обработки обращений</p>
              </div>
            </div>
            <div className={styles["header-end"]}>
              <button className={styles["logout-button"]}>Выйти</button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles["main-container"]}>
        <div className={styles["segments-container"]}>
          <button 
            className={`${styles["segment-button"]} ${activeTab === "appeals" ? styles["segment-button-primary"] : styles["segment-button-secondary"]}`}
            onClick={() => handleTabClick("appeals")}
          >
            Обращения
            <span className={styles["segment-badge"]}>45</span>
          </button>
          <button 
            className={`${styles["segment-button"]} ${activeTab === "statistics" ? styles["segment-button-primary"] : styles["segment-button-secondary"]}`}
            onClick={() => handleTabClick("statistics")}
          >
            Статистика
          </button>
        </div>

        {activeTab === "appeals" ? <Appeals /> : <Statistics />}
      </main>
    </div>
  );
}