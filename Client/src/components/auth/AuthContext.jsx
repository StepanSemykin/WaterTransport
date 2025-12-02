import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";

import { apiFetch } from "../../api/api.js";

const AuthContext = createContext(null);

const INITIAL_USER_STATE = {
  id: null,
  phone: null,
  // createdAt: null,
  // lastLoginAt: null,
  // isActive: false,
  // failedLoginAttempts: null,
  // lockedUntil: null,
  role: null,

  nickname: null,
  firstName: null,
  lastName: null,
  patronymic: null,
  email: null,
  birthday: null,
  about: null,
  location: null,
  // isPublic: false,
  // updatedAt: null,

  upcomingTrips: [],
  completedTrips: [],
  stats: [],
};

const ME_ENDPOINT = "/api/users/me";
const LOGIN_ENDPOINT = "/api/users/login";
// const USER_PROFILE_ENDPOINT = "/api/userprofiles/me";
const USER_PROFILE_ENDPOINT = "/api/userprofiles";
const LOGOUT_ENDPOINT = "/api/users/logout";
const PORTS_ENDPOINT = "/api/ports/all";
const SHIP_TYPES_ENDPOINT = "/api/shiptypes";
const MY_SHIPS_ENDPOINT = "/api/ships/my-ships"; 
const SHIP_IMAGES_ENDPOINT = "/api/shipimages/file";
const POSSIBLE_TRIPS_ENDPOINT = "/api/rentorders/available-for-partner";
const UPCOMING_TRIPS_COMMON_ENDPOINT = "/api/rentorders/get-for-user-by-status/status=Agreed";
const COMPLETED_TRIPS_COMMON_ENDPOINT = "/api/rentorders/get-for-user-by-status/status=Completed";
const UPCOMING_TRIPS_PARTNER_ENDPOINT = "/api/rentorders/get-for-partner-by-status/status=Agreed";
const COMPLETED_TRIPS_PARTNER_ENDPOINT = "/api/rentorders/get-for-partner-by-status/status=Completed";
const ACTIVE_ORDER_ENDPOINT = "/api/rentorders/active";

const LOCATION = "/auth";

const PARTNER_ROLE = "partner";
const COMMON_ROLE = "common";

const POLL_INTERVAL = 30000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(INITIAL_USER_STATE);
  const [loading, setLoading] = useState(true);

  const [ports, setPorts] = useState([]);
  const [portsLoading, setPortsLoading] = useState(true);

  const [shipTypes, setShipTypes] = useState([]);
  const [shipTypesLoading, setShipTypesLoading] = useState(true);

  const [userShips, setUserShips] = useState([]);
  const [userShipsLoading, setUserShipsLoading] = useState(false);

  const [activeRentOrder, setActiveRentOrder] = useState(null);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);

  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [upcomingTripsLoading, setUpcomingTripsLoading] = useState(false);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [completedTripsLoading, setCompletedTripsLoading] = useState(false);
  const [possibleTrips, setPossibleTrips] = useState([]);
  const [possibleTripsLoading, setPossibleTripsLoading] = useState(false);

  const [upcomingPolling, setUpcomingPolling] = useState(true);
  const [possiblePolling, setPossiblePolling] = useState(true);

  const hasFetched = useRef(false);
  const inFlight = useRef(false);

  async function loadPorts() {
    setPortsLoading(true);
    try {
      const res = await apiFetch(PORTS_ENDPOINT, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setPorts(Array.isArray(data.items) ? data.items : []);
      }
    }
    catch (err) {
      console.warn("[AuthContext] ports load failed", err);
    } 
    finally {
      setPortsLoading(false);
    }
  }

  async function loadShipTypes() {
    setShipTypesLoading(true);
    try {
      const res = await apiFetch(SHIP_TYPES_ENDPOINT, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setShipTypes(Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []));
      }
    } 
    catch (err) {
      console.warn("[AuthContext] ship types load failed", err);
    } 
    finally {
      setShipTypesLoading(false);
    }
  }

  async function loadShipImages(shipId) {
    if (!shipId) return [];

    const url = `${SHIP_IMAGES_ENDPOINT}/${shipId}`;

    return [
      {
        id: shipId,
        isPrimary: true,
        url,
      },
    ];
  }

  async function loadAllShipImages(ships) {
    if (!Array.isArray(ships) || ships.length === 0) return ships;

    try {
      const shipsWithImages = await Promise.all(
        ships.map(async (ship) => {
          const images = await loadShipImages(ship.id);
          const primaryImage = images.find(img => img.isPrimary) || images[0] || null;
          
          return {
            ...ship,
            images,
            primaryImage,
          };
        })
      );
      
      return shipsWithImages;
    } 
    catch (err) {
      console.warn("[AuthContext] Failed to load ship images:", err);
      return ships;
    }
  }

  async function loadUserShips(userId) {
    if (!userId) {
      setUserShips([]);
      return;
    }

    setUserShipsLoading(true);
    try {
      const res = await apiFetch(MY_SHIPS_ENDPOINT, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        const ships = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
        const shipsWithImages = await loadAllShipImages(ships);
        setUserShips(shipsWithImages);
      } 
      else {
        setUserShips([]);
      }
    } 
    catch (err) {
      console.warn("[AuthContext] user ships load failed", err);
      setUserShips([]);
    } 
    finally {
        setUserShipsLoading(false);
    }
  }

 const loadActiveOrder = useCallback(async (role) => {
    if (role === PARTNER_ROLE) {
      setActiveRentOrder(null);
      setHasActiveOrder(false);
      return;
    }
    try {
      const res = await apiFetch(ACTIVE_ORDER_ENDPOINT, { method: "GET" });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        setActiveRentOrder(data);
        const id = data?.id ?? data?.Id ?? null;
        setHasActiveOrder(Boolean(id));
      } 
      else {
        setActiveRentOrder(null);
        setHasActiveOrder(false);
      }
    } 
    catch {
      setActiveRentOrder(null);
      setHasActiveOrder(false);
    }
  }, []);

  async function loadUpcomingTrips(userId, endpoint) {
    if (!userId) {
      setUpcomingTrips([]);
      return;
    }
    setUpcomingTripsLoading(true);
    try {
      const res = await apiFetch(endpoint, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setUpcomingTrips(Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []));
      } 
      else {
        setUpcomingTrips([]);
      }
    } 
    catch (err) {
      console.warn("[AuthContext] upcoming trips load failed", err);
      setUpcomingTrips([]);
    } 
    finally {
      setUpcomingTripsLoading(false);
    }
  }

  // Загрузка завершенных поездок
  async function loadCompletedTrips(userId, endpoint) {
    if (!userId) {
      setCompletedTrips([]);
      return;
    }
    setCompletedTripsLoading(true);
    try {
      const res = await apiFetch(endpoint, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setCompletedTrips(Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []));
      } 
      else {
        setCompletedTrips([]);
      }
    } 
    catch (err) {
      console.warn("[AuthContext] completed trips load failed", err);
      setCompletedTrips([]);
    } 
    finally {
      setCompletedTripsLoading(false);
    }
  }

  async function loadPossibleTrips(userId) {
    if (!userId) {
      setPossibleTrips([]);
      return;
    }
    setPossibleTripsLoading(true);
    try {
      const res = await apiFetch(`${POSSIBLE_TRIPS_ENDPOINT}/${userId}`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setPossibleTrips(Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []));
      } 
      else {
        setPossibleTrips([]);
      }
    } 
    catch (err) {
      console.warn("[AuthContext] possible trips load failed", err);
      setPossibleTrips([]);
    } 
    finally {
      setPossibleTripsLoading(false);
    }
  }

  useEffect(() => {
    if (!upcomingPolling || !user?.id) return;

    let cancelled = false;
    let intervalId;

    async function pollUpcoming() {
      try {
        const res = await apiFetch(UPCOMING_TRIPS_ENDPOINT, { method: "GET" });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
          setUpcomingTrips(items);
        }
      } 
      catch (err) {
        if (!cancelled) console.warn("[AuthContext] upcoming poll failed", err);
      } 
      finally {
        if (!cancelled) setUpcomingTripsLoading(false);
      }
    }

    setUpcomingTripsLoading(true);
    pollUpcoming();
    intervalId = setInterval(pollUpcoming, POLL_INTERVAL);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [upcomingPolling, user?.id]);

  useEffect(() => {
    if (!possiblePolling || user?.role !== "partner" || !user?.id) return;

    let cancelled = false;
    let intervalId;

    async function pollPossible() {
      try {
        const res = await apiFetch(`${POSSIBLE_TRIPS_ENDPOINT}/${user.id}`, { method: "GET" });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
          setPossibleTrips(items);
        }
      } 
      catch (err) {
        if (!cancelled) console.warn("[AuthContext] possible poll failed", err);
      } 
      finally {
        if (!cancelled) setPossibleTripsLoading(false);
      }
    }

    setPossibleTripsLoading(true);
    pollPossible();
    intervalId = setInterval(pollPossible, POLL_INTERVAL);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [possiblePolling, user?.role, user?.id]);

  async function refreshUser({ force = false } = {}) {
    if ((hasFetched.current || inFlight.current) && !force) return;

    inFlight.current = true;
    setLoading(true);

    try {
      const accountRes = await apiFetch(ME_ENDPOINT, { method: "GET" });
      await Promise.all([loadPorts(), loadShipTypes()]);

      if (!accountRes.ok) {
        setUser(INITIAL_USER_STATE);
        setUserShips([]);
        hasFetched.current = true;
        return;
      }

      const account = await accountRes.json();
      const nextUser = { ...INITIAL_USER_STATE, ...account };

      if (account?.id) {
        try {
          const profileRes = await apiFetch(`${USER_PROFILE_ENDPOINT}/${account.id}`, {method: "GET"});

          if (profileRes.ok) {
            const profile = await profileRes.json();
            Object.assign(nextUser, {
              nickname: profile.nickname,
              firstName: profile.firstName,
              lastName: profile.lastName,
              patronymic: profile.patronymic,
              email: profile.email,
              birthday: profile.birthday,
              about: profile.about,
              location: profile.location,
              isPublic: profile.isPublic,
              updatedAt: profile.updatedAt,
              stats: Array.isArray(profile.stats) ? profile.stats : nextUser.stats,
            });
          }
        } 
        catch (profileErr) {
          console.warn("[AuthContext] Failed to fetch UserProfileDto:", profileErr);
        }
        if (account.role === PARTNER_ROLE) {
          await loadUserShips(account.id);
          await loadPossibleTrips(account.id);
          await loadUpcomingTrips(account.id, UPCOMING_TRIPS_PARTNER_ENDPOINT),
          await loadCompletedTrips(account.id, COMPLETED_TRIPS_PARTNER_ENDPOINT),
          console.log(account.id);
        }
        else if (account.role === COMMON_ROLE) {
          await loadActiveOrder(account.role);
          await loadUpcomingTrips(account.id, UPCOMING_TRIPS_COMMON_ENDPOINT),
          await loadCompletedTrips(account.id, COMPLETED_TRIPS_COMMON_ENDPOINT),
          console.log(account.id);
        }

        // await Promise.all([
        //   loadUpcomingTrips(account.id),
        //   loadCompletedTrips(account.id),
        // ]);
      }

      setUser((prev) => ({ ...prev, ...nextUser }));
      hasFetched.current = true;
    } 
    catch (err) {
      console.error("[AuthContext] Failed to refresh user:", err);
      setUser(INITIAL_USER_STATE);
      setUserShips([]);
      hasFetched.current = true;
    } 
    finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await apiFetch(LOGOUT_ENDPOINT, { method: "POST" });
    } 
    finally {
      setUser(INITIAL_USER_STATE);
      setUserShips([]);
      hasFetched.current = false;
      window.location.href = LOCATION;
    }
  }

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      ports,
      portsLoading,
      shipTypes,
      shipTypesLoading,
      userShips,
      userShipsLoading,
      loadUserShips,
      loadShipImages,
      loadAllShipImages,
      upcomingTrips,
      upcomingTripsLoading,
      completedTrips,
      completedTripsLoading,
      loadUpcomingTrips,
      loadCompletedTrips,
      possibleTrips,
      possibleTripsLoading,
      loadPossibleTrips,
      upcomingPolling,
      setUpcomingPolling,
      possiblePolling,
      setPossiblePolling,
      activeRentOrder,
      hasActiveOrder,
      loadActiveOrder,
      refreshUser,
      logout,
      isAuthenticated: Boolean(user?.phone),
      role: user?.role,
      isCommon: user?.role === COMMON_ROLE,
      isPartner: user?.role === PARTNER_ROLE,
    }),
    [
      user, loading, 
      ports, portsLoading, 
      shipTypes, shipTypesLoading, 
      userShips, userShipsLoading, 
      upcomingTrips, upcomingTripsLoading,
      completedTrips, completedTripsLoading,
      possibleTrips, possibleTripsLoading,
      upcomingPolling, possiblePolling,
      activeRentOrder, hasActiveOrder, loadActiveOrder
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}