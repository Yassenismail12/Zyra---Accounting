import axios from 'axios'
import { AUTH_TOKEN_KEY } from '../auth/storage'

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim() || '/api'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
