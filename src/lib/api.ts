// Central API client. Base URL from VITE_API_URL (.env), defaults to localhost:5000.
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TOKEN_KEY = "bsc_admin_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request<T = any>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth, headers, ...rest } = options;
  const h: Record<string, string> = { ...(headers as any) };
  if (!(rest.body instanceof FormData)) h["Content-Type"] = "application/json";
  if (auth) {
    const tok = getToken();
    if (tok) h["Authorization"] = `Bearer ${tok}`;
  }
  const res = await fetch(`${BASE}${path}`, { ...rest, headers: h });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export const api = {
  base: BASE,

  // --- Auth ---
  login: (email: string, password: string) =>
    request<{ token: string; admin: any }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // --- Plans ---
  getPlans: () => request<any[]>("/api/plans"),
  getPlan: (id: string) => request<any>(`/api/plans/${id}`),
  adminPlans: () => request<any[]>("/api/plans/admin/all", { auth: true }),
  createPlan: (body: any) =>
    request("/api/plans", { method: "POST", body: JSON.stringify(body), auth: true }),
  updatePlan: (id: string, body: any) =>
    request(`/api/plans/${id}`, { method: "PUT", body: JSON.stringify(body), auth: true }),
  deletePlan: (id: string) => request(`/api/plans/${id}`, { method: "DELETE", auth: true }),

  // --- Reviews ---
  getReviews: () => request<any[]>("/api/reviews"),
  submitReview: (body: any) =>
    request("/api/reviews", { method: "POST", body: JSON.stringify(body) }),
  adminReviews: () => request<any[]>("/api/reviews/admin/all", { auth: true }),
  updateReview: (id: string, body: any) =>
    request(`/api/reviews/${id}`, { method: "PUT", body: JSON.stringify(body), auth: true }),
  deleteReview: (id: string) => request(`/api/reviews/${id}`, { method: "DELETE", auth: true }),

  // --- Articles ---
  getArticles: () => request<any[]>("/api/articles"),
  getArticle: (id: string) => request<any>(`/api/articles/${id}`),
  adminArticles: () => request<any[]>("/api/articles/admin/all", { auth: true }),
  createArticle: (body: any) =>
    request("/api/articles", { method: "POST", body: JSON.stringify(body), auth: true }),
  updateArticle: (id: string, body: any) =>
    request(`/api/articles/${id}`, { method: "PUT", body: JSON.stringify(body), auth: true }),
  deleteArticle: (id: string) => request(`/api/articles/${id}`, { method: "DELETE", auth: true }),

  // --- Contact ---
  submitContact: (body: any) =>
    request("/api/contact", { method: "POST", body: JSON.stringify(body) }),
  adminInquiries: () => request<any[]>("/api/contact/admin/all", { auth: true }),
  deleteInquiry: (id: string) => request(`/api/contact/${id}`, { method: "DELETE", auth: true }),

  // --- Sponsors ---
  submitSponsor: (body: any) =>
    request<{ ok: boolean; planLabel: string; amount: number; id: string }>("/api/sponsors", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  adminSponsors: () => request<any[]>("/api/sponsors/admin/all", { auth: true }),
  updateSponsor: (id: string, body: any) =>
    request(`/api/sponsors/${id}`, { method: "PUT", body: JSON.stringify(body), auth: true }),
  deleteSponsor: (id: string) => request(`/api/sponsors/${id}`, { method: "DELETE", auth: true }),
  
  // --- Upload (S3) ---
  upload: async (file: File, folder = "uploads") => {
    const fd = new FormData();
    fd.append("file", file);
    return request<{ url: string; key: string }>(`/api/upload?folder=${folder}`, {
      method: "POST",
      body: fd,
      auth: true,
    });
  },
};
