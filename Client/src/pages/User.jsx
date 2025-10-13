import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

import { StatsCard } from "../components/dashboards/StatsCard.jsx";
import { AccountHeader } from "../components/account/AccountHeader.jsx";
import { Navigation } from "../components/navigation/Navigation.jsx"

import UserOrders from "../components/user/UserOrders.jsx";
import UserSettings from "../components/user/UserSettings.jsx";
import UserSupport from "../components/user/UserSupport.jsx";

import styles from "./User.module.css";

const STATS = [
  { title: "Всего заказов", value: "10" },
  { title: "Рейтинг", value: "5.0" },
  { title: "Время в пути", value: "100ч" },
];

const USER = {
  firstName: "Степан",
  lastName: "Семыкин",
  email: "semykin@semykin.com",
  registred: "На сайте с 01.01.2025",
};

const USER_NAVIGATION = {
  orders: { label: "Заказы", component: <UserOrders /> },
  settings: { label: "Настройки", component: <UserSettings /> },
  support: { label: "Поддержка", component: <UserSupport /> },
};

export default function User() {

  return (
    <div className={styles["user-page"]}>
      <div className={styles["user-header"]}>
        <AccountHeader {...USER} />
      </div>

      <Container className={styles["user-container"]}>
        <div className={styles["user-stats"]}>
          {STATS.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <Navigation params={USER_NAVIGATION} />;    
      </Container>
      
    </div>
  );
}
