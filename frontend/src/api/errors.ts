import axios from 'axios'
import { unwrapMessage } from './contracts'

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
  offlineMessage = 'Cannot reach API. Please try again.',
): string {
  if (!axios.isAxiosError(error)) {
    return fallback
  }

  if (!error.response) {
    return offlineMessage
  }

  return unwrapMessage(error.response.data, fallback)
}
