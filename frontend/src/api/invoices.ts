import { api } from './axios'

export async function fetchInvoices(): Promise<unknown> {
  const { data } = await api.get<unknown>('/invoices')
  return data
}
