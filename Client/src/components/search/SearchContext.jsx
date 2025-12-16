import { createContext, useContext, useMemo, useRef, useState } from "react";
import { apiFetch } from "../../api/api";

const SearchContext = createContext(null);

const PORTS_ENDPOINT = "/api/ports/all";

export function SearchProvider({ children }) {
  const [params, setParams] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);  
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  async function performSearch(payload) {
    if (locked) {
      return Promise.reject(
        new Error("У вас уже есть активный поиск. Подтвердите или отмените текущие результаты.")
      );
    }

    if (inFlight.current) {
      return Promise.reject(new Error("Поиск уже выполняется"));
    }

    inFlight.current = true;
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch(PORTS_ENDPOINT, { method: "GET" });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const data = await res.json();

      setParams(payload);
      setResults(data);

      sessionStorage.setItem("canOpenResults", "1");

      setLocked(true);

      return data;
    } 
    catch (e) {
      setError(e.message);
      throw e;
    } 
    finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  function clearSearch() {
    setParams(null);
    setResults(null);
    setError("");
    setLocked(false);                      
    sessionStorage.removeItem("canOpenResults");
  }

  function confirmResults() {
    setLocked(false);   
    setResults(null);                   
    setParams(null);                    
    sessionStorage.removeItem("canOpenResults");
  }

  function cancelResults() {
    clearSearch();                          
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
