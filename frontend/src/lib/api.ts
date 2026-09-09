const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  search: (query: string, domain?: string) =>
    request<any>("/api/search-standards", { method: "POST", body: JSON.stringify({ query, domain, language: "en" }) }),
  analyze: (text: string) =>
    request<any>("/api/analyze-specification", { method: "POST", body: JSON.stringify({ text, language: "en" }) }),
  recommend: (body: any) =>
    request<any>("/api/recommend-product", { method: "POST", body: JSON.stringify(body) }),
  explain: (requirement: string, language = "en") =>
    request<any>("/api/explain-requirement", { method: "POST", body: JSON.stringify({ requirement, language }) }),
  safety: (text: string) =>
    request<any>("/api/safety-checklist", { method: "POST", body: JSON.stringify({ text, language: "en" }) }),
  standard: (id: number) => request<any>(`/api/standards/${id}`),
  product: (id: number) => request<any>(`/api/products/${id}`)
};

export async function uploadTender(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/api/analyze-tender`, { method: "POST", body: form });
  if (!res.ok) throw new Error((await res.json()).detail || "Tender analysis failed");
  return res.json();
}
