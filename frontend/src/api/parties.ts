import { api } from './axios'
import { type ApiEnvelope, unwrapList, unwrapMessage } from './contracts'

export interface Party {
  id: number
  name: string
  type: string
  phone: string | null
  address: string | null
}

export interface CreatePartyPayload {
  name: string
  type: string
  phone: string
  address: string
}

export async function fetchParties(): Promise<Party[]> {
  const { data } = await api.get<ApiEnvelope<Party[]> | Party[]>('/parties')
  return unwrapList(data)
}

export async function createParty(payload: CreatePartyPayload): Promise<string> {
  const { data } = await api.post<ApiEnvelope<unknown>>('/parties', payload)
  return unwrapMessage(data, 'Party created successfully.')
}
