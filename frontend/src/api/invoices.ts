import { api } from './axios'
import { type ApiEnvelope, unwrapList, unwrapMessage } from './contracts'

export interface Invoice {
  id: number
  type: 'SALE' | 'PURCHASE' | 'INTERNAL'
  invoice_date: string
  status: string | null
  total: number
  party_id: number | null
}

export interface CreateInvoicePayload {
  type: 'SALE' | 'PURCHASE' | 'INTERNAL'
  invoice_date: string
  status: 'PAID' | 'UNPAID' | null
  notes: string | null
  party_id: number | null
  created_by: number
  items: Array<{
    product_id: number
    qty: number
  }>
}

export async function fetchInvoices(): Promise<Invoice[]> {
  const { data } = await api.get<ApiEnvelope<Invoice[]> | Invoice[]>('/invoices')
  return unwrapList(data)
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<string> {
  const { data } = await api.post<ApiEnvelope<unknown>>('/invoices', payload)
  return unwrapMessage(data, 'Invoice created successfully.')
}
