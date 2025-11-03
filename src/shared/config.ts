export const CONFIG = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  TOKEN_COOKIE_NAME: import.meta.env.VITE_TOKEN_COOKIE_NAME || 'token',
  TOKEN_EXPIRY_DAYS: import.meta.env.VITE_TOKEN_EXPIRY_DAYS || 7,
}
