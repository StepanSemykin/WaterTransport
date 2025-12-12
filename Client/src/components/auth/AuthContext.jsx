import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";

import { apiFetch } from "../../api/api.js";

const AuthContext = createContext(null);

const INITIAL_USER_STATE = {
  id: null,
  phone: null,
  role: null,
  nickname: null,
  firstName: null,
  lastName: null,
  patronymic: null,
  email: null,
  birthday: null,
  about: null,
  location: null,
  upcomingTrips: [],
  completedTrips: [],
  stats: [],
};

const ME_ENDPOINT = "/api/users/me";
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
const PENDING_TRIPS_PARTNER_ENDPOINT = "/api/offerspartner/offers/status=Pending";
const REJECTED_TRIPS_PARTNER_ENDPOINT = "/api/offerspartner/offers/status=Rejected";
const REJECTED_TRIPS_COMMON_ENDPOINT = "/api/rentorders/get-for-user-by-status/status=Discontinued";
const ACTIVE_ORDER_ENDPOINT = "/api/rentorders/active";
const USER_IMAGES_ENDPOINT = "/api/userimages/file";

const LOCATION = "/auth";

const PARTNER_ROLE = "partner";
const COMMON_ROLE = "common";

const POLL_INTERVAL = 30000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(INITIAL_USER_STATE);
  const [loading, setLoading] = useState(true);

  const [userImage, setUserImage] = useState(null);
  const [userImageLoading, setUserImageLoading] = useState(false);

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
  const [pendingTrips, setPendingTrips] = useState([]);
  const [pendingTripsLoading, setPendingTripsLoading] = useState(false);
  const [rejectedTrips, setRejectedTrips] = useState([]);
  const [rejectedTripsLoading, setRejectedTripsLoading] = useState(false);

  const [upcomingPolling, setUpcomingPolling] = useState(true);
  const [possiblePolling, setPossiblePolling] = useState(true);
  const [pendingPolling, setPendingPolling] = useState(true);
  const [rejectedPolling, setRejectedPolling] = useState(true);
  const [completedPolling, setCompletedPolling] = useState(true);

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

  async function loadUserImage(userId) {
    if (!userId) {
      setUserImage(null);
      return;
    }
    const url = `${USER_IMAGES_ENDPOINT}/${userId}`;
    setUserImage(url);
  }

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

  async function loadPossibleTrips(userId, endpoint) {
    if (!userId) {
      setPossibleTrips([]);
      return;
    }
    setPossibleTripsLoading(true);
    try {
      const res = await apiFetch(`${endpoint}/${userId}`, { method: "GET" });
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

  async function loadPendingTrips(userId, endpoint) {
    if (!userId) {
      setPendingTrips([]);
      return;
    }
    setPendingTripsLoading(true);
    try {
      const res = await apiFetch(endpoint, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setPendingTrips(Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []));
        console.log(data);
      } 
      else {
        setPendingTrips([]);
      }
    } 
    catch (err) {
      console.warn("[AuthContext] pending trips load failed", err);
      setPendingTrips([]);
    } 
    finally {
      setPendingTripsLoading(false);
    }
  }

  async function loadRejectedTrips(userId, endpoint) {
    if (!userId) {
      setRejectedTrips([]);
      return;
    }
    setRejectedTripsLoading(true);
    try {
      const res = await apiFetch(endpoint, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setRejectedTrips(Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []));
      } 
      else {
        setRejectedTrips([]);
      }
    } 
    catch (err) {
      console.warn("[AuthContext] rejected trips load failed", err);
      setRejectedTrips([]);
    } 
    finally {
      setRejectedTripsLoading(false);
    }
  }

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;
    let upcomingIntervalId;
    let completedIntervalId;
    let possibleIntervalId;
    let pendingIntervalId;
    let rejectedIntervalId;

    async function pollUpcoming() {
      try {
        const endpoint =
          user.role === PARTNER_ROLE
            ? UPCOMING_TRIPS_PARTNER_ENDPOINT
            : UPCOMING_TRIPS_COMMON_ENDPOINT;

        const res = await apiFetch(endpoint, { method: "GET" });
        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
            ? data
            : [];
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

    async function pollPossible() {
      try {
        const res = await apiFetch(`${POSSIBLE_TRIPS_ENDPOINT}/${user.id}`, {
          method: "GET",
        });
        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
            ? data
            : [];
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

    async function pollPending() {
      try {
        const res = await apiFetch(PENDING_TRIPS_PARTNER_ENDPOINT, {
          method: "GET",
        });
        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
            ? data
            : [];
          setPendingTrips(items);
        }
      } 
      catch (err) {
        if (!cancelled) console.warn("[AuthContext] pending poll failed", err);
      } 
      finally {
        if (!cancelled) setPendingTripsLoading(false);
      }
    }

    async function pollRejected() {
      try {
        const endpoint =
          user.role === PARTNER_ROLE
          ? REJECTED_TRIPS_PARTNER_ENDPOINT
          : REJECTED_TRIPS_COMMON_ENDPOINT;

        const res = await apiFetch(endpoint, {
          method: "GET",
        });
        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
            ? data
            : [];
          setRejectedTrips(items);
        }
      } 
      catch (err) {
        if (!cancelled) console.warn("[AuthContext] rejected poll failed", err);
      } 
      finally {
        if (!cancelled) setRejectedTripsLoading(false);
      }
    }

    async function pollCompleted() {
      try {
        const endpoint =
          user.role === PARTNER_ROLE
            ? COMPLETED_TRIPS_PARTNER_ENDPOINT
            : COMPLETED_TRIPS_COMMON_ENDPOINT;

        const res = await apiFetch(endpoint, { method: "GET" });
        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
            ? data
            : [];
          setCompletedTrips(items);
        }
      } 
      catch (err) {
        if (!cancelled) console.warn("[AuthContext] completed poll failed", err);
      } 
      finally {
        if (!cancelled) setCompletedTripsLoading(false);
      }
    }

    if (upcomingPolling) {
      setUpcomingTripsLoading(true);
      pollUpcoming();
      upcomingIntervalId = setInterval(pollUpcoming, POLL_INTERVAL);
    }

    if (possiblePolling && user.role === PARTNER_ROLE) {
      setPossibleTripsLoading(true);
      pollPossible();
      possibleIntervalId = setInterval(pollPossible, POLL_INTERVAL);
    }

    if (pendingPolling && user.role === PARTNER_ROLE) {
      setPendingTripsLoading(true);
      pollPending();
      pendingIntervalId = setInterval(pollPending, POLL_INTERVAL);
    }

    if (rejectedPolling) {
      setRejectedTripsLoading(true);
      pollRejected();
      rejectedIntervalId = setInterval(pollRejected, POLL_INTERVAL);
    }

    if (completedPolling) {
      setCompletedTripsLoading(true);
      pollCompleted();
      completedIntervalId = setInterval(pollCompleted, POLL_INTERVAL);
    }
    
    return () => {
      cancelled = true;
      if (upcomingIntervalId) clearInterval(upcomingIntervalId);
      if (possibleIntervalId) clearInterval(possibleIntervalId);
      if (pendingIntervalId) clearInterval(pendingIntervalId);
      if (rejectedIntervalId) clearInterval(rejectedIntervalId);
      if (completedIntervalId) clearInterval(completedIntervalId);
    };
  }, [user?.id, user?.role, upcomingPolling, possiblePolling, pendingPolling, rejectedPolling, completedPolling]);

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

        await loadUserImage(account.id);

        if (account.role === PARTNER_ROLE) {
          await loadUserShips(account.id);
          await loadPossibleTrips(account.id, POSSIBLE_TRIPS_ENDPOINT);
          await loadUpcomingTrips(account.id, UPCOMING_TRIPS_PARTNER_ENDPOINT),
          await loadCompletedTrips(account.id, COMPLETED_TRIPS_PARTNER_ENDPOINT),
          await loadPendingTrips(account.id, PENDING_TRIPS_PARTNER_ENDPOINT),
          await loadRejectedTrips(account.id, REJECTED_TRIPS_PARTNER_ENDPOINT),
          console.log(account.id);
        }
        else if (account.role === COMMON_ROLE) {
          await loadActiveOrder(account.role);
          await loadUpcomingTrips(account.id, UPCOMING_TRIPS_COMMON_ENDPOINT),
          await loadCompletedTrips(account.id, COMPLETED_TRIPS_COMMON_ENDPOINT),
          console.log(account.id);
        }
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
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      userImage,
      userImageLoading,
      loadUserImage,
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
      pendingTrips,
      pendingTripsLoading,
      rejectedTrips,
      rejectedTripsLoading,
      loadRejectedTrips,
      loadPendingTrips,
      loadUpcomingTrips,
      loadCompletedTrips,
      possibleTrips,
      possibleTripsLoading,
      loadPossibleTrips,
      upcomingPolling,
      setUpcomingPolling,
      possiblePolling,
      setPossiblePolling,
      pendingPolling,
      setPendingPolling,
      rejectedPolling,
      setRejectedPolling,
      completedPolling,
      setCompletedPolling,
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
      userImage, userImageLoading,
      ports, portsLoading, 
      shipTypes, shipTypesLoading, 
      userShips, userShipsLoading, 
      upcomingTrips, upcomingTripsLoading,
      completedTrips, completedTripsLoading,
      pendingTrips, pendingTripsLoading,
      possibleTrips, possibleTripsLoading,
      upcomingPolling, possiblePolling,
      pendingPolling, rejectedPolling, completedPolling,
      rejectedTrips, rejectedTripsLoading,
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