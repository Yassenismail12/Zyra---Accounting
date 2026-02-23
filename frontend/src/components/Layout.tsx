import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { BrandMark } from './BrandMark'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '#', label: 'Invoices' },
  { to: '#', label: 'Products' },
  { to: '#', label: 'Parties' },
  { to: '#', label: 'Settings' },
]

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand">
          <BrandMark compact />
        </Link>
        <nav className="nav">
          {navItems.map((item) =>
            item.to === '#' ? (
              <span key={item.label} className="nav-link muted">
                {item.label}
              </span>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' nav-link-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
      </aside>

      <div className="content-area">
        <header className="topbar">
          <h1 className="topbar-title">ZYRA (Accounting)</h1>
          <div className="topbar-right">
            <p className="user-meta">
              {user?.email ?? 'Unknown user'} ({user?.role ?? 'N/A'})
            </p>
            <button type="button" className="btn btn-outline" onClick={handleLogout}>
              Logout
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
