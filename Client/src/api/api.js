export async function apiFetch(path, init = {}) {
  return fetch(path, {
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    ...init,
  });
}

// api.js
// export async function apiFetch(path, init = {}) {
//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 15000); // 15s

//   // Запрещаем абсолютные URL — чтобы ВСЕ шли через Vite proxy
//   if (/^https?:\/\//i.test(path)) {
//     console.warn("[apiFetch] Avoid absolute URLs; use /api/... to go through Vite proxy:", path);
//   }

//   const hasBody = "body" in init && init.body != null;
//   const isForm = hasBody && (init.body instanceof FormData);

//   const headers = {
//     Accept: "application/json",
//     // Ставим JSON только если реально шлём JSON-объект
//     ...(hasBody && !isForm && typeof init.body === "object"
//       ? { "Content-Type": "application/json" }
//       : {}),
//     ...(init.headers || {}),
//   };

//   // Если передали объект как body — превратим в JSON
//   const body =
//     hasBody && !isForm && typeof init.body === "object"
//       ? JSON.stringify(init.body)
//       : init.body;

//   const url =
//     path.startsWith("/") ? path : `/${path}`; // гарантируем ведущий слэш

//   try {
//     const res = await fetch(url, {
//       credentials: "include",
//       signal: controller.signal,
//       ...init,
//       headers,
//       ...(hasBody ? { body } : {}),
//     });
//     return res;
//   } catch (err) {
//     console.error("[apiFetch] Failed to fetch:", { url, err });
//     throw err;
//   } finally {
//     clearTimeout(timeout);
//   }
// }
