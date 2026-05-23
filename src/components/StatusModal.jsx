import { useState } from 'react'

const STATUS_OPTIONS = [
  { value: 'connected',    label: 'Connected',    color: 'text-emerald-700' },
  { value: 'disconnected', label: 'Disconnected', color: 'text-red-700' },
  { value: 'pending',      label: 'Pending',      color: 'text-amber-700' },
]

export default function StatusModal({ consumer, onSave, onClose }) {
  const [status, setStatus] = useState(consumer.status)
  const [note, setNote]     = useState('')

  function handleSave() {
    onSave(consumer.id, status)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-sm">Update Status</h2>
            <p className="text-slate-400 text-xs mt-0.5">{consumer.consumerId} — {consumer.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Consumer info pill */}
          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 space-y-1">
            <div><span className="font-medium text-slate-700">Agency:</span> {consumer.agency}</div>
            <div><span className="font-medium text-slate-700">Meter:</span> {consumer.meterCode}</div>
            <div><span className="font-medium text-slate-700">Dues:</span> ₹{consumer.outstandingDues.toLocaleString()}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Status</label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                    status === opt.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value)}
                    className="accent-blue-600"
                  />
                  <span className={`text-sm font-medium ${opt.color}`}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Note <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Reason for status change…"
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}  className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} className="btn-primary flex-1">Save Changes</button>
        </div>
      </div>
    </div>
  )
}
