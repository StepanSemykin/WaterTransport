import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

import { StatsCard } from "../components/dashboards/StatsCard.jsx";
import { AccountHeader } from "../components/account/AccountHeader.jsx";

import UserOrders from "../components/user/UserOrders.jsx";
import PartnerShips from "../components/partner/PartnerShips.jsx"
import PartnerSettings from "../components/partner/PartnerSettings.jsx"
import PartnerSupport from "../components/partner/PartnerSupport.jsx"
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

export default function User() {
  const [activeTab, setActiveTab] = useState("orders");

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

        <Navbar bg="light" bg-body-tertiary expand="md" className={styles["user-navbar"]}>
          <Container>
            <Nav
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className={styles["user-nav"]}
            >
              <Nav.Item>
                <Nav.Link eventKey="orders">Заказы</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ships">Суда</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="settings">Настройки</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="support">Поддержка</Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
        </Navbar>

        <div className={styles["user-content"]}>
          {activeTab === "orders" && <UserOrders />}
          {activeTab === "ships" && <PartnerShips />}
          {activeTab === "settings" && <PartnerSettings />}
          {activeTab === "support" && <PartnerSupport />}
        </div>
      </Container>
      
    </div>
  );
}