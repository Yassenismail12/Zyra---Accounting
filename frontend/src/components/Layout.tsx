import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useI18n } from '../i18n'
import { BrandMark } from './BrandMark'

const navItems = [
  { to: '/dashboard', key: 'layout.nav.overview' },
  { to: '/invoices', key: 'layout.nav.invoices' },
  { to: '/inventory', key: 'layout.nav.inventory' },
  { to: '/parties', key: 'layout.nav.parties' },
]

const pageTitleMap: Record<string, string> = {
  '/dashboard': 'layout.nav.overview',
  '/invoices': 'layout.nav.invoices',
  '/inventory': 'layout.nav.inventory',
  '/parties': 'layout.nav.parties',
}

export function Layout() {
  const { user, logout } = useAuth()
  const { t, toggleLang } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const pageTitle = t(pageTitleMap[location.pathname] ?? 'layout.nav.overview')

  return (
    <div className="app-shell">
      <aside className="shell-sidebar">
        <Link to="/dashboard" className="shell-brand" aria-label={t('layout.goDashboard')}>
          <BrandMark compact />
        </Link>

        <nav className="shell-nav" aria-label={t('layout.nav.main')}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `shell-nav-link${isActive ? ' shell-nav-link-active' : ''}`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="content-area">
        <header className="topbar">
          <div>
            <p className="topbar-overline">{t('layout.brandOverline')}</p>
            <h1 className="topbar-title">{pageTitle}</h1>
          </div>
          <div className="topbar-right">
            <button type="button" className="btn btn-outline lang-switch" onClick={toggleLang}>
              {t('common.language')}
            </button>
            <p className="user-meta">{user?.email ?? t('common.unknownUser')}</p>
            <button type="button" className="btn btn-outline" onClick={handleLogout}>
              {t('common.logout')}
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
