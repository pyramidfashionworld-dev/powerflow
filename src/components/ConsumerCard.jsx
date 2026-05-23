// Individual consumer card used in the grid view
export default function ConsumerCard({ consumer, onUpdateStatus }) {
  const badgeClass = {
    connected:    'badge-connected',
    disconnected: 'badge-disconnected',
    pending:      'badge-pending',
  }[consumer.status]

  const statusDot = {
    connected:    'bg-emerald-500',
    disconnected: 'bg-red-500',
    pending:      'bg-amber-500',
  }[consumer.status]

  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">

      {/* Top row: ID + status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-mono text-blue-600 font-semibold">{consumer.consumerId}</span>
          <h3 className="text-slate-800 font-semibold text-sm leading-snug mt-0.5">{consumer.name}</h3>
        </div>
        <span className={`${badgeClass} flex-shrink-0 flex items-center gap-1`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
          {consumer.status.charAt(0).toUpperCase() + consumer.status.slice(1)}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
        <Detail label="Agency"    value={consumer.agency} />
        <Detail label="Phase"     value={consumer.phaseClass} />
        <Detail label="Meter"     value={consumer.meterCode} />
        <Detail label="Device"    value={consumer.deviceId} />
        <Detail label="Mobile"    value={consumer.mobile} span />
        <Detail label="Address"   value={consumer.address} span />
      </div>

      {/* Dues */}
      <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
        <span className="text-xs text-slate-500">Outstanding Dues</span>
        <span className={`text-sm font-bold ${consumer.outstandingDues > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
          ₹{consumer.outstandingDues.toLocaleString()}
        </span>
      </div>

      {/* Due dates */}
      <div className="text-xs text-slate-400 flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {consumer.dueDateStart} → {consumer.dueDateEnd}
      </div>

      {/* Action */}
      <button
        onClick={() => onUpdateStatus(consumer)}
        className="mt-1 w-full border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg py-2 text-xs font-semibold transition-colors"
      >
        Update Status
      </button>
    </div>
  )
}

function Detail({ label, value, span }) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <div className="text-slate-400 uppercase tracking-wide text-[10px]">{label}</div>
      <div className="text-slate-700 font-medium truncate">{value}</div>
    </div>
  )
}
