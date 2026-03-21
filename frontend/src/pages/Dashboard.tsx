import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchInvoices } from '../api/invoices'
import { fetchProducts } from '../api/products'
import { getApiErrorMessage } from '../api/errors'
import { useI18n } from '../i18n'
import { StatCard } from '../components/StatCard'

export function DashboardPage() {
  const { t, locale } = useI18n()
  const { data: invoices = [], error: invoicesError } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  })
  const { data: products = [], error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const metrics = useMemo(() => {
    const now = new Date()
    const cycleEnd = new Date(
      now.getFullYear(),
      now.getMonth() + (now.getDate() > 25 ? 1 : 0),
      25,
      23,
      59,
      59,
      999,
    )
    const cycleStart = new Date(
      cycleEnd.getFullYear(),
      cycleEnd.getMonth() - 1,
      26,
      0,
      0,
      0,
      0,
    )

    const monthlyInvoices = invoices.filter((invoice) => {
      const date = new Date(invoice.invoice_date)
      if (Number.isNaN(date.getTime())) {
        return false
      }
      return date >= cycleStart && date <= cycleEnd
    })

    const unpaidInvoices = invoices.filter(
      (invoice) => (invoice.status || '').toUpperCase() === 'UNPAID',
    )
    const unpaidSold = unpaidInvoices.filter(
      (invoice) => (invoice.type || '').toUpperCase() === 'SALE',
    ).length
    const unpaidPurchased = unpaidInvoices.filter(
      (invoice) => (invoice.type || '').toUpperCase() === 'PURCHASE',
    ).length

    const periodLabel = `${cycleStart.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
    })} - ${cycleEnd.toLocaleDateString(locale, { month: 'short', day: 'numeric' })}`

    return {
      monthlyInvoicesTotal: monthlyInvoices.length,
      unpaidSold,
      unpaidPurchased,
      stockItems: products.length,
      periodLabel,
    }
  }, [invoices, locale, products])

  const quickActions = useMemo(
    () => [
      {
        to: '/invoices',
        title: t('pages.dashboard.quick.invoices.title'),
        subtitle: t('pages.dashboard.quick.invoices.subtitle'),
      },
      {
        to: '/inventory',
        title: t('pages.dashboard.quick.inventory.title'),
        subtitle: t('pages.dashboard.quick.inventory.subtitle'),
      },
      {
        to: '/parties',
        title: t('pages.dashboard.quick.parties.title'),
        subtitle: t('pages.dashboard.quick.parties.subtitle'),
      },
    ],
    [t],
  )

  const loadError = invoicesError
    ? getApiErrorMessage(invoicesError, t('pages.dashboard.error.invoices'))
    : productsError
      ? getApiErrorMessage(productsError, t('pages.dashboard.error.products'))
      : null

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <p className="section-kicker">{t('pages.dashboard.kicker')}</p>
        <h2 className="section-title">{t('pages.dashboard.title')}</h2>
        <p className="section-subtitle">{t('pages.dashboard.subtitle')}</p>
      </div>

      {loadError ? <p className="table-error">{loadError}</p> : null}

      <div className="dashboard-stats-grid">
        <StatCard
          label={t('pages.dashboard.stat.monthly', { period: metrics.periodLabel })}
          value={String(metrics.monthlyInvoicesTotal)}
        />
        <StatCard label={t('pages.dashboard.stat.unpaid')} value={`${metrics.unpaidSold} / ${metrics.unpaidPurchased}`} />
        <StatCard label={t('pages.dashboard.stat.stockItems')} value={String(metrics.stockItems)} />
      </div>

      <div className="dashboard-nav-grid">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to} className="dashboard-nav-card">
            <p className="dashboard-nav-title">{action.title}</p>
            <p className="dashboard-nav-subtitle">{action.subtitle}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
