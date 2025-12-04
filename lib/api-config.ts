// Get API URL - use server-side URL in Docker, client-side URL in browser
const getApiUrl = () => {
  // Server-side (Docker container or SSR)
  if (typeof window === "undefined") {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://backend:3001"
  }
  // Client-side (browser)
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
}

export const API_CONFIG = {
  // Dynamically determine the base URL based on context
  baseUrl: getApiUrl(),

  // Endpoints
  endpoints: {
    products: "/api/products",
    categories: "/api/categories",
    upload: "/api/upload",
    authVerify: "/api/auth/verify",
    newsletterSubscribe: "/api/newsletter/subscribe",
  },
}

// Helper to create Basic Auth header
export function createBasicAuthHeader(username: string, password: string): string {
  const credentials = Buffer.from(`${username}:${password}`).toString("base64")
  return `Basic ${credentials}`
}

// Store credentials in sessionStorage (client-side only)
export function storeCredentials(username: string, password: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("adminAuth", createBasicAuthHeader(username, password))
  }
}

export function getStoredAuthHeader(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("adminAuth")
  }
  return null
}

export function clearCredentials(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("adminAuth")
  }
}

// API helper functions
export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_CONFIG.baseUrl}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
  return response
}

export async function fetchProtectedApi(endpoint: string, options: RequestInit = {}) {
  const authHeader = getStoredAuthHeader()
  if (!authHeader) {
    throw new Error("Not authenticated")
  }

  const url = `${API_CONFIG.baseUrl}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
      ...options.headers,
    },
  })
  return response
}
