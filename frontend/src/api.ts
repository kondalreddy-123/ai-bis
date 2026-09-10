const BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";

async function request(
  path: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    throw new Error(
      body.detail ||
        `Request failed (${res.status})`
    );
  }

  return res.json();
}

export const api = {
  analyze: (
    text: string,
    language: string
  ) =>
    request("/api/analyze-specification", {
      method: "POST",
      body: JSON.stringify({
        text,
        language,
      }),
    }),

  search: (
    query: string,
    domain?: string
  ) =>
    request("/api/search-standards", {
      method: "POST",
      body: JSON.stringify({
        query,
        domain,
      }),
    }),

  standard: (id: string) =>
    request(`/api/standards/${id}`),

  /* NEW */
  recommend: (
    text: string,
    language: string
  ) =>
    request("/api/recommend-standards", {
      method: "POST",
      body: JSON.stringify({
        text,
        language,
      }),
    }),

  /* NEW */
  compareStandards: (ids: string[]) =>
    request("/api/compare-standards", {
      method: "POST",
      body: JSON.stringify({
        standard_ids: ids,
      }),
    }),

  safety: (payload: any) =>
    request("/api/safety-checklist", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  tender: async (file: File) => {
    const fd = new FormData();

    fd.append("file", file);

    const res = await fetch(
      `${BASE}/api/analyze-tender`,
      {
        method: "POST",
        body: fd,
      }
    );

    if (!res.ok) {
      throw new Error(
        "Tender analysis failed"
      );
    }

    return res.json();
  },
};
