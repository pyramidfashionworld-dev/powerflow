import { useNavigate, useLocation } from 'react-router-dom'

// ─── ICONS (inline SVG, no external dep) ─────────────────────────────────────
function Icon({ name, className = 'w-5 h-5' }) {
  const icons = {
    bolt:       <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
    dashboard:  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    users:      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    logout:     <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
    agency:     <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    menu:       <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />,
    user:       <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  }
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {icons[name]}
    </svg>
  )
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ onAgencyModal, onMobileClose }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const raw       = localStorage.getItem('pf_user')
  const user      = raw ? JSON.parse(raw) : { name: 'User', role: 'user' }

  function logout() {
    localStorage.removeItem('pf_user')
    navigate('/')
  }

  const links = [
    { label: 'Dashboard',     icon: 'dashboard', path: '/dashboard' },
    { label: 'Consumer Hub',  icon: 'users',     path: '/consumers' },
  ]

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon name="bolt" className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-base leading-tight">PowerFlow</div>
            <div className="text-slate-500 text-xs">Utility Mgmt</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(link => (
          <button
            key={link.path}
            onClick={() => { navigate(link.path); onMobileClose?.() }}
            className={`sidebar-link w-full text-left ${location.pathname === link.path ? 'active' : ''}`}
          >
            <Icon name={link.icon} className="w-5 h-5 flex-shrink-0" />
            {link.label}
          </button>
        ))}

        <button
          onClick={() => { onAgencyModal(); onMobileClose?.() }}
          className="sidebar-link w-full text-left"
        >
          <Icon name="agency" className="w-5 h-5 flex-shrink-0" />
          Agency Updates
        </button>
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-blue-600/40 rounded-full flex items-center justify-center">
            <Icon name="user" className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="text-xs text-slate-500 capitalize">{user.role}</div>
          </div>
        </div>
        <button onClick={logout} className="sidebar-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <Icon name="logout" className="w-5 h-5 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

// ─── MAIN LAYOUT WRAPPER ─────────────────────────────────────────────────────
import { useState } from 'react'
import AgencyModal from '../components/AgencyModal'

export default function Layout({ children }) {
  const [showAgency,  setShowAgency]  = useState(false)
  const [mobileSidebar, setMobileSidebar] = useState(false)

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-60 flex-shrink-0 border-r border-white/5">
        <Sidebar onAgencyModal={() => setShowAgency(true)} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 flex flex-col shadow-2xl">
            <Sidebar
              onAgencyModal={() => { setShowAgency(true); setMobileSidebar(false) }}
              onMobileClose={() => setMobileSidebar(false)}
            />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileSidebar(false)} />
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="bolt" className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">PowerFlow</span>
          </div>
          <button onClick={() => setMobileSidebar(true)}>
            <Icon name="menu" className="w-6 h-6" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Agency modal */}
      {showAgency && <AgencyModal onClose={() => setShowAgency(false)} />}
    </div>
  )
}
