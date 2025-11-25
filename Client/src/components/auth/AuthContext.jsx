import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

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
const LOCATION = "/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(INITIAL_USER_STATE);
  const [loading, setLoading] = useState(true);

  const [ports, setPorts] = useState([]);
  const [portsLoading, setPortsLoading] = useState(true);

  const [shipTypes, setShipTypes] = useState([]);
  const [shipTypesLoading, setShipTypesLoading] = useState(true);

  const [userShips, setUserShips] = useState([]);
  const [userShipsLoading, setUserShipsLoading] = useState(false);

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

    // try {
    //   const res = await apiFetch(`${SHIP_IMAGES_ENDPOINT}/${shipId}`, { 
    //     method: "GET" 
    //   });
      
    //   if (res.ok) {
    //     const data = await res.json();
    //     return Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
    //   }
      
    //   return [];
    // } 
    // catch (err) {
    //   console.warn(`[AuthContext] Failed to load images for ship ${shipId}:`, err);
    //   return [];
    // }
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
        if (account.role === "partner") {
          await loadUserShips(account.id);
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
      refreshUser,
      logout,
      isAuthenticated: Boolean(user?.phone),
      role: user?.role,
      isCommon: user?.role === "common",
      isPartner: user?.role === "partner",
    }),
    [user, loading, ports, portsLoading, shipTypes, shipTypesLoading, userShips, userShipsLoading, userShips, userShipsLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}