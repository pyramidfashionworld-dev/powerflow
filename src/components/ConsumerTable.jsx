// Table view of consumers — shown when user toggles to table mode
export default function ConsumerTable({ consumers, onUpdateStatus }) {
  const badgeClass = {
    connected:    'badge-connected',
    disconnected: 'badge-disconnected',
    pending:      'badge-pending',
  }

  if (consumers.length === 0) {
    return (
      <div className="card p-12 text-center text-slate-400">
        <div className="text-4xl mb-3">🔍</div>
        <div className="font-medium">No consumers found</div>
        <div className="text-sm mt-1">Try adjusting your filters</div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Consumer', 'Agency', 'Address', 'Mobile', 'Dues (₹)', 'Phase', 'Status', 'Action'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {consumers.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-mono text-blue-600 text-xs font-semibold">{c.consumerId}</div>
                  <div className="text-slate-800 font-medium text-xs mt-0.5 whitespace-nowrap">{c.name}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded">
                    {c.agency}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 text-xs max-w-[180px] truncate">{c.address}</td>
                <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{c.mobile}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`font-bold text-xs ${c.outstandingDues > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    ₹{c.outstandingDues.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{c.phaseClass}</td>
                <td className="px-4 py-3">
                  <span className={badgeClass[c.status]}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onUpdateStatus(c)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold whitespace-nowrap bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
