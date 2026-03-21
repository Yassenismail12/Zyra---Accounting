import { api } from './axios'
import type { LoginResponse } from '../auth/types'

export interface LoginPayload {
  email: string
  password: string
}

interface ApiEnvelope<T> {
  success?: boolean
  data?: T
  message?: string
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse | ApiEnvelope<LoginResponse>>(
    '/auth/login',
    payload,
  )

  if ('token' in data && 'user' in data) {
    return data
  }

  if (data && typeof data === 'object' && 'data' in data && data.data) {
    const nested = data.data
    if (
      nested &&
      typeof nested === 'object' &&
      'token' in nested &&
      'user' in nested
    ) {
      return nested as LoginResponse
    }
  }

  throw new Error('Unexpected login response shape')
}
