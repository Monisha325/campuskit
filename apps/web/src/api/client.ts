export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export type ApiError = Error & { status?: number };

export function getToken() { return localStorage.getItem("campuskit-token"); }

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "Request failed." })) as { error?: string };
    const error = new Error(body.error ?? "Request failed.") as ApiError;
    error.status = response.status;
    throw error;
  }
  return response.json() as Promise<T>;
}
