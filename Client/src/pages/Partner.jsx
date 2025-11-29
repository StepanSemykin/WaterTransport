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

import styles from "./User.module.css";

import YachtIcon from "../assets/yacht.jpg"
import DateIcon from "../assets/date.png"
import PortIcon from "../assets/port.png"
import ShipIcon from "../assets/ship.png"
import WheelIcon from "../assets/wheel.png"
import PassengersIcon from "../assets/passengers.png"
import ChatIcon from "../assets/chat.png"
import StarOnIcon from "../assets/star-on.png"
import StarOffIcon from "../assets/star-off.png"


const STATS = [
  { title: "Всего заказов", value: "10" },
  { title: "Рейтинг", value: "5.0" },
  { title: "Всего судов", value: "1" },
];

const USER = {
  firstName: "Сергей",
  lastName: "Иванов",
  email: "ivanov@ivanov.com",
  registred: "На сайте с 01.01.2025",
  isPartner: true
};

const SHIPS = [
  {
    imageSrc: YachtIcon,
    imageAlt: "Luxury Yacht Marina",
    title: { iconSrc: ShipIcon, iconAlt: "судно", text: "Luxury Yacht Marina" },
    status: "Активно",
    type: { iconSrc: ShipIcon, iconAlt: "судно", text: "Яхта"},
    details: [
      { iconSrc: PassengersIcon, iconAlt: "пассажиры", text: "До 20 человек" }
    ],
    rating: 5.0,
    actions: [
      { label: "Посмотреть детали" }
    ],
  }
]

const UPCOMING_TRIPS = [
  {
    imageSrc: YachtIcon,
    imageAlt: "Luxury Yacht Marina",
    title: { iconSrc: ShipIcon, iconAlt:"ship", text: "Luxury Yacht Marina" },
    confirm: "Подтверждено",
    status: "upcoming",
    captain: { iconSrc: WheelIcon, iconAlt:"captain", text:"Сергей Иванов" },
    portDeparture: { iconSrc: PortIcon, iconAlt:"port", text:"Речной вокзал" },
    portArrival: { iconSrc: PortIcon, iconAlt:"port", text:"Причал №5" },
    details: [
      { iconSrc: DateIcon, iconAlt: "date", text: "07.07.2025" },
      { text: "12:00" },
    ],
    actions: [
      { label: "Посмотреть детали" }
    ],
  },
];

const COMPLETED_TRIPS = [
  {
    imageSrc: YachtIcon,
    imageAlt: "Luxury Yacht Marina",
    title: { iconSrc: ShipIcon, iconAlt:"ship", text: "Luxury Yacht Marina" },
    confirm: "",
    status: "completed",
    captain: { iconSrc: WheelIcon, iconAlt:"captain", text:"Сергей Иванов" },
    portDeparture: { iconSrc: PortIcon, iconAlt:"port", text:"Речной вокзал" },
    portArrival: { iconSrc: PortIcon, iconAlt:"port", text:"Причал №5" },
    details: [
      { iconSrc: DateIcon, iconAlt: "date", text: "06.06.2025" },
      { text: "12:00" },
    ],
    rating: [
      { src: StarOffIcon, alt: "Star Off" },
      { src: StarOffIcon, alt: "Star Off" },
      { src: StarOnIcon, alt: "Star On" },
      { src: StarOnIcon, alt: "Star On" },
      { src: StarOnIcon, alt: "Star On" }
    ],
    actions: [
      { label: "Посмотреть детали" }
    ],
  },
];

const POSSIBLE_TRIPS = [
  {
    imageSrc: YachtIcon,
    imageAlt: "Luxury Yacht Marina",
    title: { iconSrc: ShipIcon, iconAlt:"ship", text: "Luxury Yacht Marina" },
    confirm: "Подтвердить",
    status: "possible",
    captain: { iconSrc: WheelIcon, iconAlt:"captain", text:"Сергей Иванов" },
    portDeparture: { iconSrc: PortIcon, iconAlt:"port", text:"Речной вокзал" },
    portArrival: { iconSrc: PortIcon, iconAlt:"port", text:"Причал №5" },
    details: [
      { iconSrc: DateIcon, iconAlt: "date", text: "08.08.2025" },
      { text: "12:00" },
    ],
    actions: [
      { label: "Посмотреть детали" }
    ],
  },
];

const SETTINGS_ITEMS = [
  { key: "account", label: "Учетная запись", content: <AccountSettings/>, icon: "Home" },
  { key: "notifications", label: "Уведомления", content: "Уведомления", icon: "Notifications" },
  { key: "bookings", label: "Автоподтверждение бронирования", content: "Автоподтверждение бронирования", icon: "Notifications" },
  { key: "exit", label: "Выйти из аккаунта", content: <LogoutSettings />, icon: "Notifications" }
];

const SUPPORT_ITEMS = [
  { key: "support", label: "Чат с поддержкой", content: "Чат с поддержкой" },
  { key: "transporter", label: "Чат с заказчиком", content: "Чат с заказчиком" },
  { key: "problem", label: "Сообщить о проблеме", content: "Сообщить о проблеме" }
];

const USER_NAVIGATION = {
  orders: { label: "Заказы", component: <UserOrders upcomingTrips={UPCOMING_TRIPS} completedTrips={COMPLETED_TRIPS} possibleTrips={POSSIBLE_TRIPS} isPartner={USER.isPartner}  /> },
  ships: {label: "Суда", component: <UserShips ships={SHIPS}/>},
  settings: { label: "Настройки", component: <UserSettingsMenu items={SETTINGS_ITEMS}/> },
  support: { label: "Поддержка", component: <UserSupportMenu items={SUPPORT_ITEMS} /> },
};

export default function Partner() {
  const { user, loading, refreshUser } = useAuth();

  if (loading) {
    return <div className={styles["user-page"]}>Загрузка кабинета…</div>;
  }

  return (
    <div className={styles["user-page"]}>
      
      <div className={styles["user-header"]}>
        {/* <AccountHeader {...USER} /> */}
        <AccountHeader
          firstName={user.firstName ?? ""}
          lastName={user.lastName ?? ""}
          email={user.email ?? ""}
          location={user.location ?? ""}
        />
      </div>

      <Container className={styles["user-container"]}>
        <div className={styles["user-stats"]}>
          {/* {STATS.map((stat) => (
            <StatsCard key={stat.title} {...stat} /> */}

          {(user.stats ?? []).map((stat) => (
          <StatsCard key={stat.title} {...stat} />
          ))}
        </div>  

        <Navigation
          params={{
            orders: {
              label: "Заказы",
              component: (
                <UserOrders
                  upcomingTrips={user.upcomingTrips ?? []}
                  completedTrips={user.completedTrips ?? []}
                />
                // <UserOrders 
                //   upcomingTrips={UPCOMING_TRIPS} 
                //   completedTrips={COMPLETED_TRIPS} />
              ),
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

        {/* <Navigation params={USER_NAVIGATION} />     */}
      </Container>
      
    </div>
  );
}