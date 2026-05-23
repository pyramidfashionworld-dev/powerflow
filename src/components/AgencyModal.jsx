import { AGENCY_UPDATES } from '../data/mockData'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'Just now'
}

export default function AgencyModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">Agency Updates</h2>
            <p className="text-slate-400 text-xs mt-0.5">Last sync status per field agency</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {AGENCY_UPDATES.map(a => (
            <div key={a.name} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50">
              {/* Colour dot */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
                style={{ backgroundColor: a.color }}>
                {a.name.slice(0, 2)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 text-sm">{a.name}</div>
                <div className="text-slate-400 text-xs mt-0.5">Last update: {timeAgo(a.lastUpdate)}</div>
              </div>

              <div className="flex-shrink-0 text-right">
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  {a.pendingTasks} pending
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full btn-primary text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
