export interface ApiEnvelope<T> {
  success?: boolean
  data?: T
  message?: string
  error?: {
    message?: string
  }
}

export function unwrapList<T>(payload: ApiEnvelope<T[]> | T[]): T[] {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload && typeof payload === 'object' && Array.isArray(payload.data)) {
    return payload.data
  }

  return []
}

export function unwrapMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const message = (payload as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message
    }

    const nestedMessage = (payload as { error?: { message?: unknown } }).error?.message
    if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
      return nestedMessage
    }
  }

  return fallback
}
