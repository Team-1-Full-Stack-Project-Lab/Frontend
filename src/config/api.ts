const rawApiMode = (import.meta.env.VITE_API_MODE || 'REST').toUpperCase()
export const API_MODE = rawApiMode === 'GRAPHQL' ? 'GraphQL' : 'REST'
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
export const TOKEN_COOKIE_NAME = 'token'
export const TOKEN_EXPIRY_DAYS = 7
