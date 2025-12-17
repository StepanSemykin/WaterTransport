import { Container } from "react-bootstrap";

import { useAuth } from "../components/auth/AuthContext.jsx";
import { StatsCard } from "../components/dashboards/StatsCard.jsx";
import { AccountHeader } from "../components/account/AccountHeader.jsx";
import { Navigation } from "../components/navigation/Navigation.jsx"

import UserOrders from "../components/user/orders/UserOrders.jsx";
import UserShips from "../components/user/ships/UserShips.jsx";
import UserSettingsMenu from "../components/user/settings/UserSettingsMenu.jsx";
import UserSupportMenu from "../components/user/support/UserSupportMenu.jsx";
import AccountSettings from "../components/user/settings/AccountSettings.jsx";
import LogoutSettings from "../components/user/settings/LogOutSettings.jsx";
import ChangePassword from "../components/user/settings/ChangePassword.jsx";

import styles from "./User.module.css";

const SETTINGS_ITEMS = [
  { key: "account", label: "Учетная запись", content: <AccountSettings/>, icon: "Home" },
  { key: "password", label: "Сменить пароль", content: <ChangePassword/>},
  { key: "exit", label: "Выйти из аккаунта", content: <LogoutSettings />, icon: "Notifications" }
];

const SUPPORT_ITEMS = [
  { key: "support", label: "Чат с поддержкой", content: "Чат с поддержкой" },
  { key: "transporter", label: "Чат с заказчиком", content: "Чат с заказчиком" },
  { key: "problem", label: "Сообщить о проблеме", content: "Сообщить о проблеме" }
];

export default function Partner() {
  const {
    user,
    loading,
    userImage,
    userImageLoading,
    upcomingTrips,
    upcomingTripsLoading,
    pendingTrips, 
    pendingTripsLoading,
    completedTrips,
    completedTripsLoading,
    possibleTrips,
    possibleTripsLoading,
    rejectedTrips, 
    rejectedTripsLoading,
  } = useAuth();

  if (loading) {
    return <div className={styles["user-page"]}>Загрузка кабинета…</div>;
  }

  const ordersComponent = (
    <UserOrders
      rejectedTrips={rejectedTrips}
      rejectedTripsLoading={rejectedTripsLoading}
      pendingTrips={pendingTrips}
      pendingTripsLoading={pendingTripsLoading}
      upcomingTrips={upcomingTrips}
      upcomingTripsLoading={upcomingTripsLoading}
      completedTrips={completedTrips}
      completedTripsLoading={completedTripsLoading}
      possibleTrips={possibleTrips}
      possibleTripsLoading={possibleTripsLoading}
      isPartner={true}
    />
  );  

  return (
    <div className={styles["user-page"]}>
      
      <div className={styles["user-header"]}>
        <AccountHeader
          firstName={user.firstName ?? ""}
          lastName={user.lastName ?? ""}
          email={user.email ?? ""}
          location={user.location ?? ""}
          userId={user?.id}
          profileImage={userImage}
          profileImageLoading={userImageLoading}
          isPartner={user?.role === "partner"}
        />
      </div>

      <Container className={styles["user-container"]}>
        <div className={styles["user-stats"]}>
          {(user.stats ?? []).map((stat) => (
          <StatsCard key={stat.title} {...stat} />
          ))}
        </div>  

        <Navigation
          params={{
            orders: {
              label: "Заказы",
              component: ordersComponent,
            },
            ships: {
              label: "Суда",
              component: <UserShips ships={user.userShips ?? []} />,
            },
            settings: {
              label: "Настройки",
              component: <UserSettingsMenu items={SETTINGS_ITEMS} />,
            },
            support: {
              label: "Поддержка",
              component: <UserSupportMenu items={SUPPORT_ITEMS} />,
            },
          }}
        />
      </Container>
      
    </div>
  );
}