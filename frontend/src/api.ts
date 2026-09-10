
const BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://ai-bis-sensor-1.onrender.com";

async function request(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  let data: any = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      `Request failed (${response.status})`
    );
  }

  return data;
}

export const api = {
  health: () => request("/api/health"),

  analyze: (text: string, language = "English") =>
    request("/api/analyze-specification", {
      method: "POST",
      body: JSON.stringify({ text, language }),
    }),

  search: (query: string, domain?: string) =>
    request("/api/search-standards", {
      method: "POST",
      body: JSON.stringify({
        query,
        ...(domain ? { domain } : {}),
      }),
    }),

  recommend: (text: string, language = "English") =>
    request("/api/recommend-standards", {
      method: "POST",
      body: JSON.stringify({ text, language }),
    }),

  compareStandards: (standard_ids: string[]) =>
    request("/api/compare-standards", {
      method: "POST",
      body: JSON.stringify({ standard_ids }),
    }),

  safety: (payload: any) =>
    request("/api/safety-checklist", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  explain: (text: string, language = "English") =>
    request("/api/explain-requirement", {
      method: "POST",
      body: JSON.stringify({ text, language }),
    }),

  translate: (text: string, language: string) =>
    request("/api/translate", {
      method: "POST",
      body: JSON.stringify({ text, language }),
    }),

  tender: (file: File) => {
    const form = new FormData();
    form.append("file", file);

    return request("/api/analyze-tender", {
      method: "POST",
      body: form,
    });
  },
};

export { BASE };
