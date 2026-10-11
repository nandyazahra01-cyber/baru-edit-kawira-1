const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

let accessToken: string | null = null;
export function setAccessToken(token: string | null) { accessToken = token; }

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init.headers ?? {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? `HTTP_${response.status}`);
  return body as T;
}

export type KawiraRole = "mentee" | "mentor" | "admin";
export interface KawiraUser {
  id: string; name: string; email: string; role: KawiraRole; status: "active" | "blocked" | "pending";
}
export async function login(email: string, password: string) {
  const result = await api<{ user: KawiraUser; token: string }>("/auth/login", {
    method: "POST", body: JSON.stringify({ email, password })
  });
  setAccessToken(result.token);
  return result;
}
export async function logout() {
  try { await api("/auth/logout", { method: "POST" }); }
  finally { setAccessToken(null); }
}
