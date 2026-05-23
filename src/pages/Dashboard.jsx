import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getConsumers, AGENCY_UPDATES } from '../data/mockData'

// Nav card definitions
function getCards(consumers) {
  const disconnected = consumers.filter(c => c.status === 'disconnected').length
  const pending      = consumers.filter(c => c.status === 'pending').length
  const connected    = consumers.filter(c => c.status === 'connected').length
  const totalDues    = consumers.reduce((s, c) => s + c.outstandingDues, 0)

  return [
    {
      title: 'Disconnection',
      desc: 'Manage active disconnection orders',
      icon: '🔌',
      badge: disconnected,
      badgeColor: 'bg-red-500',
      color: 'from-red-50 to-rose-50',
      border: 'border-red-100',
      filter: '?status=disconnected',
    },
    {
      title: 'Reconnection',
      desc: 'Process pending reconnection requests',
      icon: '⚡',
      badge: pending,
      badgeColor: 'bg-amber-500',
      color: 'from-amber-50 to-yellow-50',
      border: 'border-amber-100',
      filter: '?status=pending',
    },
    {
      title: 'Active Consumers',
      desc: 'Currently connected consumers',
      icon: '✅',
      badge: connected,
      badgeColor: 'bg-emerald-500',
      color: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-100',
      filter: '?status=connected',
    },
    {
      title: 'Deemed Visit',
      desc: 'Field visits — meter not accessible',
      icon: '🗺️',
      badge: Math.ceil(disconnected * 0.4),
      badgeColor: 'bg-blue-500',
      color: 'from-blue-50 to-indigo-50',
      border: 'border-blue-100',
      filter: '',
    },
    {
      title: 'DTR Management',
      desc: 'Distribution transformer records',
      icon: '🏗️',
      badge: consumers.length,
      badgeColor: 'bg-purple-500',
      color: 'from-purple-50 to-violet-50',
      border: 'border-purple-100',
      filter: '',
    },
    {
      title: 'NSC Inspection',
      desc: 'New service connection inspections',
      icon: '🔍',
      badge: pending,
      badgeColor: 'bg-slate-500',
      color: 'from-slate-50 to-gray-50',
      border: 'border-slate-100',
      filter: '?status=pending',
    },
  ]
}

function StatBanner({ consumers }) {
  const total        = consumers.length
  const disconnected = consumers.filter(c => c.status === 'disconnected').length
  const pending      = consumers.filter(c => c.status === 'pending').length
  const totalDues    = consumers.reduce((s, c) => s + c.outstandingDues, 0)

  const stats = [
    { label: 'Total Consumers', value: total, color: 'text-blue-600' },
    { label: 'Disconnected',    value: disconnected, color: 'text-red-600' },
    { label: 'Pending',         value: pending, color: 'text-amber-600' },
    { label: 'Total Dues',      value: `₹${(totalDues / 1000).toFixed(1)}K`, color: 'text-purple-600' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map(s => (
        <div key={s.label} className="card px-5 py-4">
          <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const navigate  = useNavigate()
  const consumers = getConsumers()
  const cards     = getCards(consumers)

  const raw  = localStorage.getItem('pf_user')
  const user = raw ? JSON.parse(raw) : { name: 'User' }

  return (
    <Layout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">Welcome back, {user.name} 👋</p>
      </div>

      {/* Stat banner */}
      <StatBanner consumers={consumers} />

      {/* Nav cards grid */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(card => (
            <button
              key={card.title}
              onClick={() => navigate(`/consumers${card.filter}`)}
              className={`card p-5 text-left hover:shadow-md transition-all bg-gradient-to-br ${card.color} border ${card.border} group`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className={`${card.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[1.5rem] text-center`}>
                  {card.badge}
                </span>
              </div>
              <div className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                {card.title}
              </div>
              <div className="text-slate-500 text-xs mt-1">{card.desc}</div>
              <div className="flex items-center gap-1 text-blue-600 text-xs font-medium mt-3">
                View all
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Agency summary */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Agency Overview</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Agency</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Update</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {AGENCY_UPDATES.map(a => (
                <tr key={a.name} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: a.color }}>
                        {a.name.slice(0, 2)}
                      </div>
                      <span className="font-medium text-slate-700 text-xs">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{new Date(a.lastUpdate).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="badge badge-pending">{a.pendingTasks} tasks</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
