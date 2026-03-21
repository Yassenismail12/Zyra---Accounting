import { api } from './axios'
import { type ApiEnvelope, unwrapList, unwrapMessage } from './contracts'

export interface Product {
  id: number
  name: string
  sale_price: number
  purchase_price: number
  current_stock: number
}

export interface CreateProductPayload {
  name: string
  sale_price: number
  purchase_price: number
  current_stock: number
}

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<ApiEnvelope<Product[]> | Product[]>('/products')
  return unwrapList(data)
}

export async function createProduct(payload: CreateProductPayload): Promise<string> {
  const { data } = await api.post<ApiEnvelope<unknown>>('/products', payload)
  return unwrapMessage(data, 'Product created successfully.')
}
