// import { createContext, useContext, useMemo, useRef, useState } from "react";
// import { apiFetch } from "../../api/api";

// const SearchContext = createContext(null);

// const SEARCH_ENDPOINT = "/api/search";
// const PORTS_ENDPOINT = "/api/ports/all";

// export function SearchProvider({ children }) {
//   const [params, setParams] = useState(null);
//   const [results, setResults] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [locked, setLocked] = useState(false);
//   const [error, setError] = useState("");
//   const inFlight = useRef(false);

//   const FORCE_TRUE = import.meta.env.VITE_FORCE_TRUE_SEARCH === "1";

//   async function performSearch(payload) {
//     if (inFlight.current) {
//       return Promise.reject(new Error("Поиск уже выполняется"));
//     }
    
//     inFlight.current = true;
//     setLoading(true);
//     setError("");

//     try {
//       const res = await apiFetch(PORTS_ENDPOINT, { method: "GET" });
//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(txt || `HTTP ${res.status}`);
//       }
//       const data = await res.json();
//       setParams(payload);
//       setResults(data);
//       sessionStorage.setItem("canOpenResults", "1");
//       return data;
//     } 
//     catch (e) {
//       setError(e.message);
//       throw e;
//     } 
//     finally {
//       inFlight.current = false;
//       setLoading(false);
//     }
// }
// //     try {
// //       // замените эндпоинт на ваш
// //       const res = await apiFetch(SEARCH_ENDPOINT, {
// //         method: "POST",
// //         body: JSON.stringify(payload)
// //       });
// //       if (!res.ok) {
// //         const txt = await res.text();
// //         throw new Error(txt || `HTTP ${res.status}`);
// //       }
// //       const data = await res.json();
// //       setParams(payload);
// //       setResults(data);
// //       // помечаем, что Results можно открывать (переживёт перезагрузку вкладки)
// //       sessionStorage.setItem("canOpenResults", "1");
// //       return data;
// //     } 
// //     catch (e) {
// //       setError(e.message);
// //       throw e;
// //     } 
// //     finally {
// //       inFlight.current = false;
// //       setLoading(false);
// //     }
// //   }

//   function clearSearch() {
//     setParams(null);
//     setResults(null);
//     setError("");
//     sessionStorage.removeItem("canOpenResults");
//   }

//   const value = useMemo(
//     () => ({ params, results, loading, error, performSearch, clearSearch }),
//     [params, results, loading, error]
//   );

//   return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
// }

// export function useSearch() {
//   const ctx = useContext(SearchContext);
//   if (!ctx) throw new Error("useSearch must be used within SearchProvider");
//   return ctx;
// }

import { createContext, useContext, useMemo, useRef, useState } from "react";
import { apiFetch } from "../../api/api";

const SearchContext = createContext(null);

const SEARCH_ENDPOINT = "/api/search";
const PORTS_ENDPOINT = "/api/ports/all";

export function SearchProvider({ children }) {
  const [params, setParams] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);   // 🔒 блокировка новых поисков
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  const FORCE_TRUE = import.meta.env.VITE_FORCE_TRUE_SEARCH === "1";

  async function performSearch(payload) {
    // 1) логическая блокировка, пока юзер не подтвердил/отменил
    if (locked) {
      return Promise.reject(
        new Error("У вас уже есть активный поиск. Подтвердите или отмените текущие результаты.")
      );
    }

    // 2) защита от параллельных запросов (два клика подряд)
    if (inFlight.current) {
      return Promise.reject(new Error("Поиск уже выполняется"));
    }

    inFlight.current = true;
    setLoading(true);
    setError("");

    try {
      // TODO: вернёшь обратно реальный SEARCH_ENDPOINT, когда будет готов API
      const res = await apiFetch(PORTS_ENDPOINT, { method: "GET" });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const data = await res.json();

      setParams(payload);
      setResults(data);

      // можно открыть /results даже после перезагрузки
      sessionStorage.setItem("canOpenResults", "1");

      // 🔒 ЛОГИЧЕСКИ ЗАПИРАЕМ ПОИСК, пока юзер не подтвердит/отменит
      setLocked(true);

      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  function clearSearch() {
    setParams(null);
    setResults(null);
    setError("");
    setLocked(false);                       // 🔓 сбрасываем блокировку
    sessionStorage.removeItem("canOpenResults");
  }

  // ✅ юзер подтвердил результаты (создал заказ и т.п.)
  function confirmResults() {
    // здесь можешь добавить отправку "создать заказ" и т.д.
    setLocked(false);   
    setResults(null);                   // ❗ очищаем результаты
    setParams(null);                    // разблокировали новые поиски
    sessionStorage.removeItem("canOpenResults");
    // results/params можно оставить, если они ещё нужны
  }

  // ❌ юзер отменил — всё очищаем
  function cancelResults() {
    clearSearch();                          // внутри уже и locked = false
  }

  const value = useMemo(
    () => ({
      params,
      results,
      loading,
      error,
      locked,
      performSearch,
      clearSearch,
      confirmResults,
      cancelResults,
    }),
    [params, results, loading, error, locked]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
