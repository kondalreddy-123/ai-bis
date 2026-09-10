// frontend/src/api.ts

const BASE = "https://ai-bis-sensor-1.onrender.com";

async function request(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${BASE}${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type") || "";

    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        typeof data === "object" && data?.detail
          ? data.detail
          : `API request failed: ${response.status}`;

      throw new Error(message);
    }

    return data;
  } catch (error: any) {
    console.error("BIS SENSOR API ERROR:", {
      url,
      error,
    });

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to BIS SENSOR backend. Please check the Render backend and CORS settings."
      );
    }

    throw error;
  }
}

export const api = {
  // -----------------------------------------
  // HEALTH
  // -----------------------------------------

  health: () =>
    request("/api/health", {
      method: "GET",
    }),

  // -----------------------------------------
  // PRODUCT / SPECIFICATION ANALYSIS
  // -----------------------------------------

  analyze: (text: string, language: string = "en") =>
    request("/api/analyze-specification", {
      method: "POST",
      body: JSON.stringify({
        text,
        language,
      }),
    }),

  // -----------------------------------------
  // STANDARD SEARCH
  // -----------------------------------------

  search: (query: string, domain?: string) =>
    request("/api/search-standards", {
      method: "POST",
      body: JSON.stringify({
        query,
        domain: domain || null,
      }),
    }),

  // -----------------------------------------
  // SINGLE STANDARD
  // -----------------------------------------

  standard: (id: string) =>
    request(`/api/standards/${encodeURIComponent(id)}`, {
      method: "GET",
    }),

  // -----------------------------------------
  // AI STANDARD RECOMMENDATION
  // -----------------------------------------

  recommend: (text: string, language: string = "en") =>
    request("/api/recommend-standards", {
      method: "POST",
      body: JSON.stringify({
        text,
        language,
      }),
    }),

  // -----------------------------------------
  // STANDARD COMPARISON
  // -----------------------------------------

  compareStandards: (standardIds: string[]) =>
    request("/api/compare-standards", {
      method: "POST",
      body: JSON.stringify({
        standard_ids: standardIds,
      }),
    }),

  // -----------------------------------------
  // SAFETY CHECKLIST
  // -----------------------------------------

  safety: (payload: any) =>
    request("/api/safety-checklist", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // -----------------------------------------
  // TENDER ANALYSIS
  // -----------------------------------------

  tender: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return request("/api/analyze-tender", {
      method: "POST",
      body: formData,
    });
  },

  // -----------------------------------------
  // REQUIREMENT EXPLANATION
  // -----------------------------------------

  explainRequirement: (
    requirement: string,
    language: string = "en"
  ) =>
    request("/api/explain-requirement", {
      method: "POST",
      body: JSON.stringify({
        requirement,
        language,
      }),
    }),

  // -----------------------------------------
  // VOICE QUERY
  // -----------------------------------------

  voiceQuery: (text: string, language: string = "en") =>
    request("/api/voice-query", {
      method: "POST",
      body: JSON.stringify({
        text,
        language,
      }),
    }),

  // -----------------------------------------
  // TRANSLATION
  // -----------------------------------------

  translate: (
    text: string,
    targetLanguage: string
  ) =>
    request("/api/translate", {
      method: "POST",
      body: JSON.stringify({
        text,
        target_language: targetLanguage,
      }),
    }),

  // -----------------------------------------
  // EVIDENCE
  // -----------------------------------------

  evidence: (id: string) =>
    request(`/api/evidence/${encodeURIComponent(id)}`, {
      method: "GET",
    }),

  // -----------------------------------------
  // PRODUCT
  // -----------------------------------------

  product: (id: string) =>
    request(`/api/products/${encodeURIComponent(id)}`, {
      method: "GET",
    }),
};
