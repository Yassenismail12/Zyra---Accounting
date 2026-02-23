import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { fetchInvoices } from '../api/invoices'
import { StatCard } from '../components/StatCard'
import { formatDate, formatMoney } from '../utils/format'

type GenericInvoice = Record<string, unknown>

interface DashboardStats {
  totalInvoices: string
  totalSales: string
  unpaidInvoices: string
  latestInvoiceDate: string
}

function parseInvoices(data: unknown): GenericInvoice[] {
  if (Array.isArray(data)) {
    return data.filter((item): item is GenericInvoice => typeof item === 'object' && item !== null)
  }

  if (data && typeof data === 'object') {
    const candidates = ['invoices', 'data', 'items', 'results']
    for (const key of candidates) {
      const maybeArray = (data as Record<string, unknown>)[key]
      if (Array.isArray(maybeArray)) {
        return maybeArray.filter(
          (item): item is GenericInvoice => typeof item === 'object' && item !== null,
        )
      }
    }
  }

  return []
}

function deriveStats(invoices: GenericInvoice[]): DashboardStats {
  const count = invoices.length

  let totalSales = 0
  let salesFound = false
  let unpaidCount = 0
  let unpaidFound = false
  let latestDate: Date | null = null
  let latestDateFound = false

  for (const invoice of invoices) {
    const total =
      typeof invoice.total === 'number'
        ? invoice.total
        : typeof invoice.amount === 'number'
          ? invoice.amount
          : typeof invoice.grandTotal === 'number'
            ? invoice.grandTotal
            : null

    if (total !== null) {
      salesFound = true
      totalSales += total
    }

    const statusValue =
      typeof invoice.status === 'string'
        ? invoice.status
        : typeof invoice.paymentStatus === 'string'
          ? invoice.paymentStatus
          : null

    if (statusValue !== null) {
      unpaidFound = true
      if (statusValue.toLowerCase().includes('unpaid') || statusValue.toLowerCase() === 'pending') {
        unpaidCount += 1
      }
    }

    const dateValue =
      typeof invoice.date === 'string'
        ? invoice.date
        : typeof invoice.createdAt === 'string'
          ? invoice.createdAt
          : typeof invoice.invoiceDate === 'string'
            ? invoice.invoiceDate
            : null

    if (dateValue) {
      const parsed = new Date(dateValue)
      if (!Number.isNaN(parsed.getTime())) {
        latestDateFound = true
        if (!latestDate || parsed > latestDate) {
          latestDate = parsed
        }
      }
    }
  }

  return {
    totalInvoices: String(count),
    totalSales: salesFound ? formatMoney(totalSales) : 'N/A',
    unpaidInvoices: unpaidFound ? String(unpaidCount) : 'N/A',
    latestInvoiceDate: latestDateFound && latestDate ? formatDate(latestDate) : 'N/A',
  }
}

export function DashboardPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  })

  const invoices = useMemo(() => parseInvoices(data), [data])
  const stats = useMemo(() => deriveStats(invoices), [invoices])

  let errorText: string | null = null
  if (error) {
    if (axios.isAxiosError(error)) {
      errorText = error.response?.data?.message || 'Failed to load invoices.'
    } else {
      errorText = 'Failed to load invoices.'
    }
  }

  return (
    <section>
      <div className="cards-grid">
        <StatCard label="Total invoices" value={isLoading ? 'Loading...' : stats.totalInvoices} />
        <StatCard label="Total sales" value={isLoading ? 'Loading...' : stats.totalSales} />
        <StatCard label="Unpaid invoices" value={isLoading ? 'Loading...' : stats.unpaidInvoices} />
        <StatCard
          label="Latest invoice date"
          value={isLoading ? 'Loading...' : stats.latestInvoiceDate}
        />
      </div>

      {errorText && <p className="dashboard-error">{errorText}</p>}
    </section>
  )
}
