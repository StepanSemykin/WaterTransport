import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { apiFetch } from "../../api/api.js";

const AuthContext = createContext(null);

const INITIAL_USER_STATE = {
  id: null,
  phone: null,
  createdAt: null,
  lastLoginAt: null,
  isActive: false,
  failedLoginAttempts: null,
  lockedUntil: null,
  role: null,

  nickname: null,
  firstName: null,
  lastName: null,
  patronymic: null,
  email: null,
  birthday: null,
  about: null,
  location: null,
  isPublic: false,
  updatedAt: null,

  upcomingTrips: [],
  completedTrips: [],
  stats: [],
};

const GET_MY_PROFILE_ENDPOINT = "/api/users/profile";
const LOGIN_ENDPOINT = "/api/users/login";
const USER_PROFILES_ENDPOINT = "/api/userprofiles";
const LOGOUT_ENDPOINT = "/api/users/logout";
const LOCATION = "/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(INITIAL_USER_STATE);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);
  const inFlight = useRef(false);

  async function refreshUser({ force = false } = {}) {
    if ((hasFetched.current || inFlight.current) && !force) return;

    inFlight.current = true;
    setLoading(true);

    try {
      const accountRes = await apiFetch(GET_MY_PROFILE_ENDPOINT, { method: "GET" });

      if (!accountRes.ok) {
        setUser(INITIAL_USER_STATE);
        hasFetched.current = true;
        return;
      }

      const account = await accountRes.json();
      const nextUser = { ...INITIAL_USER_STATE, ...account };

      if (account?.id) {
        try {
          const profileRes = await apiFetch(`${USER_PROFILES_ENDPOINT}/${account.id}`, {
            method: "GET",
          });

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
    } finally {
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
      refreshUser,
      logout,
      isAuthenticated: Boolean(user?.phone),
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

// import { apiFetch } from "../../api/api.js";

// const AuthContext = createContext(null);

// const INITIAL_USER_PROFILE = {
//   nick: null,
//   firstName: null,
//   lastName: null,
//   patronymic: null,
//   email: null, 
//   birthday: null,
//   about: null, 
//   location: null,
//   upcomingTrips: [],
//   completedTrips: [],
//   stats: []
// };

// const INITIAL_USER_STATE = {
//   phone: null
// }

// const GET_MY_PROFILE_ENDPOINT = "/api/users/profile";
// const LOGOUT_ENDPOINT = "/api/users/logout";
// const LOCATION = "/auth";

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(INITIAL_USER_STATE);
//   const [loading, setLoading] = useState(true);

//   // защита от дубликатов и повторных вызовов
//   const hasFetched = useRef(false);
//   const inFlight = useRef(false);

//   async function refreshUser({ force = false } = {}) {
//     if ((hasFetched.current || inFlight.current) && !force) return;

//     inFlight.current = true;
//     setLoading(true);
//     try {
//       const res = await apiFetch(GET_MY_PROFILE_ENDPOINT, { method: "GET" });

//       if (res.ok) {
//         const profile = await res.json();
//         setUser(prev => ({ ...prev, ...profile }));
//         hasFetched.current = true;            // <- помечаем как загружено
//       } 
//       else {
//         setUser(INITIAL_USER_STATE);
//         hasFetched.current = true;            // <- тоже считаем «завершили попытку»
//       }
//     } 
//     catch (err) {
//       console.error("Ошибка проверки авторизации:", err);
//       setUser(INITIAL_USER_STATE);
//       hasFetched.current = true;
//     } 
//     finally {
//       inFlight.current = false;
//       setLoading(false);
//     }
//   }

//   async function logout() {
//     try {
//       await apiFetch(LOGOUT_ENDPOINT, { method: "POST" });
//     } 
//     finally {
//       setUser(INITIAL_USER_STATE);
//       hasFetched.current = false;             // <- позволим заново загрузить после логина
//       window.location.href = LOCATION;
//     }
//   }

//   // загрузить профиль ОДИН раз на маунт (StrictMode вызовет эффект дважды — guarded)
//   useEffect(() => {
//     refreshUser();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const value = useMemo(
//     () => ({
//       user,
//       loading,
//       refreshUser, // можно вызвать вручную: refreshUser({ force: true })
//       logout,
//       isAuthenticated: Boolean(user?.phone),
//     }),
//     [user, loading]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(INITIAL_USER_STATE);
//   const [loading, setLoading] = useState(true);
//   const extrasLoaded = useRef(false);

//   async function refreshUser( withExtras = false ) {
//     try {
//       const res = await apiFetch(GET_MY_PROFILE_ENDPOINT);
//       if (res.ok) {
//         setUser(INITIAL_USER_STATE);

//         const profile = await res.json();

//         let upcomingTrips = [];
//         let completedTrips = [];
//         let stats = [];

//         // if (withExtras && !extrasLoaded.current) {
//         //   const [upcomingTripsRes, completedTripsRes, statsRes] = await Promise.allSettled([
//         //     apiFetch("/api/users/profile/upcoming"),
//         //     apiFetch("/api/users/profile/completed"),
//         //     apiFetch("/api/users/profile/stats"),
//         //   ]);

//         //   if (upcomingTripsRes.status === "fulfilled" && upcomingTripsRes.value.ok) {
//         //     upcomingTrips = await upcomingTripsRes.value.json();
//         //   }
//         //   if (completedTripsRes.status === "fulfilled" && completedTripsRes.value.ok) {
//         //     completedTrips = await completedTripsRes.value.json();
//         //   }
//         //   if (statsRes.status === "fulfilled" && statsRes.value.ok) {
//         //     stats = await statsRes.value.json();
//         //   }

//         //   extrasLoaded.current = true;
//         // }

//         setUser((prev) => ({
//         ...prev,
//         ...profile,
//         upcomingTrips: Array.isArray(upcomingTrips) && upcomingTrips.length
//           ? upcomingTrips
//           : prev.upcomingTrips,
//         completedTrips: Array.isArray(completedTrips) && completedTrips.length
//           ? completedTrips
//           : prev.completedTrips,
//         stats: Array.isArray(stats) && stats.length ? stats : prev.stats,
//       }));

//       } 
//       else {
//         setUser(INITIAL_USER_STATE);
//       }
//     } 
//     catch (err) {
//       console.error("Ошибка проверки авторизации:", err);
//       setUser(INITIAL_USER_STATE);
//     } 
//     finally {
//       setLoading(false);
//     }
//   }

//   async function logout() {
//     try {
//       await apiFetch(LOGOUT_ENDPOINT, { method: "POST" });
//     } 
//     finally {
//       setUser(INITIAL_USER_STATE);
//       extrasLoaded.current = false;
//       window.location.href = LOCATION;
//     }
//   }

//   useEffect(() => {
//     refreshUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }
