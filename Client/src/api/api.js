const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

export async function apiFetch(path, init = {}) {
  console.log("[apiFetch] path=", buildUrl(path));
  return fetch(buildUrl(path), {
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    ...init,
  });
}

export async function apiFetchRaw(path, init = {}) {
  console.log("[apiFetchRaw] path=", buildUrl(path));
  return fetch(buildUrl(path), {
    credentials: "include",
    ...init,
  });
}