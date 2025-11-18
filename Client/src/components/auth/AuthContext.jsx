import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { apiFetch } from "../../api/api.js";

const AuthContext = createContext(null);

const INITIAL_USER_STATE = {
  // id: null,
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
const USER_PROFILE_ENDPOINT = "/api/userprofiles/me";
const LOGOUT_ENDPOINT = "/api/users/logout";
const PORTS_ENDPOINT = "/api/ports/all";
const SHIP_TYPES_ENDPOINT = "/api/shiptypes";
const LOCATION = "/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(INITIAL_USER_STATE);
  const [loading, setLoading] = useState(true);
  const [ports, setPorts] = useState([]);
  const [portsLoading, setPortsLoading] = useState(true);
  const [shipTypes, setShipTypes] = useState([]);
  const [shipTypesLoading, setShipTypesLoading] = useState(true);

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

  async function refreshUser({ force = false } = {}) {
    if ((hasFetched.current || inFlight.current) && !force) return;

    inFlight.current = true;
    setLoading(true);

    try {
      const accountRes = await apiFetch(ME_ENDPOINT, { method: "GET" });
      await Promise.all([loadPorts(), loadShipTypes()]);

      if (!accountRes.ok) {
        setUser(INITIAL_USER_STATE);
        hasFetched.current = true;
        return;
      }

      const account = await accountRes.json();
      const nextUser = { ...INITIAL_USER_STATE, ...account };

      if (account?.phone) {
        try {
          const profileRes = await apiFetch(USER_PROFILE_ENDPOINT, {method: "GET"});

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
      }

      setUser((prev) => ({ ...prev, ...nextUser }));
      hasFetched.current = true;
    } 
    catch (err) {
      console.error("[AuthContext] Failed to refresh user:", err);
      setUser(INITIAL_USER_STATE);
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
      refreshUser,
      logout,
      isAuthenticated: Boolean(user?.phone),
      role: user?.role,
      isCommon: user?.role === "common",
      isPartner: user?.role === "partner",
    }),
    [user, loading, ports, portsLoading, shipTypes, shipTypesLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}