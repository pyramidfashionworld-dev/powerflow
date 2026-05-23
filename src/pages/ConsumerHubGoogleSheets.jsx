import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ConsumerCard  from '../components/ConsumerCard'
import ConsumerTable from '../components/ConsumerTable'
import StatusModal   from '../components/StatusModal'
import { STATUSES } from '../data/mockData'
import {
  fetchConsumersFromSheet,
  getCachedConsumers,
  setCachedConsumers,
  getAgenciesFromConsumers,
} from '../services/googleSheetsService'

// ─── VIEW TOGGLE ICONS ────────────────────────────────────────────────────────
function GridIcon({ active }) {
  return (
    <svg className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

function ListIcon({ active }) {
  return (
    <svg className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  )
}

// ─── PAGINATION ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-50"
      >
        ← Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            p === page ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-50"
      >
        Next →
      </button>
    </div>
  )
}

const PAGE_SIZE = 9 // consumers per page (3×3 grid)

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ConsumerHub() {
  const [searchParams] = useSearchParams()

  // Persistent view mode preference
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem('pf_view') || 'grid'
  )

  function toggleView(mode) {
    setViewMode(mode)
    localStorage.setItem('pf_view', mode)
  }

  // State management
  const [consumers, setConsumers] = useState([])
  const [agencies, setAgencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  
  const [search, setSearch] = useState('')
  const [agency, setAgency] = useState(searchParams.get('agency') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  // Fetch consumers from Google Sheets on mount
  useEffect(() => {
    loadConsumers()
  }, [])

  async function loadConsumers() {
    setLoading(true)
    setError(null)

    try {
      // Check cache first
      let data = getCachedConsumers()

      if (!data) {
        // Fetch from Google Sheets
        data = await fetchConsumersFromSheet()
        
        if (data) {
          setCachedConsumers(data)
        } else {
          throw new Error('Could not load consumer data from Google Sheets')
        }
      }

      if (data && data.length > 0) {
        setConsumers(data)
        setAgencies(getAgenciesFromConsumers(data))
        setLastUpdated(new Date().toLocaleTimeString())
      }
    } catch (err) {
      console.error('Error loading consumers:', err)
      setError(err.message || 'Failed to load consumer data')
    } finally {
      setLoading(false)
    }
  }

  async function refreshConsumers() {
    // Clear cache and reload
    localStorage.removeItem('pf_consumers_cache')
    await loadConsumers()
  }

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [search, agency, status])

  // Apply filters + search
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return consumers.filter(c => {
      if (agency && c.agency !== agency) return false
      if (status && c.status !== status) return false
      if (q && !`${c.consumerId} ${c.name} ${c.address} ${c.mobile}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [consumers, search, agency, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleStatusSave(id, newStatus) {
    const updated = consumers.map(c => c.id === id ? { ...c, status: newStatus } : c)
    setConsumers(updated)
    setCachedConsumers(updated)
  }

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading consumer data from Google Sheets...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Error state
  if (error && consumers.length === 0) {
    return (
      <Layout>
        <div className="card p-8 border-l-4 border-red-500 bg-red-50">
          <h2 className="text-red-900 font-bold mb-2">Error Loading Data</h2>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          <p className="text-red-600 text-xs mb-4">
            Make sure your Google Sheets ID and API key are configured in the <code className="bg-white px-2 py-1 rounded">.env</code> file.
          </p>
          <button
            onClick={refreshConsumers}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Page header with refresh */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Consumer Hub</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {filtered.length} consumer{filtered.length !== 1 ? 's' : ''} found
            {lastUpdated && <span className="ml-2 text-xs">• Updated: {lastUpdated}</span>}
          </p>
        </div>
        <button
          onClick={refreshConsumers}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-1"
          title="Refresh from Google Sheets"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Info banner if Google Sheets is configured */}
      {import.meta.env.VITE_GOOGLE_SHEET_ID && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
          📊 Data synced from Google Sheets • Auto-refreshes every 5 minutes
        </div>
      )}

      {/* Search + Filters + Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">

        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, name, address, mobile…"
            className="input-field pl-9"
          />
        </div>

        {/* Agency filter - now dynamic */}
        <select
          value={agency}
          onChange={e => setAgency(e.target.value)}
          className="input-field sm:w-40"
        >
          <option value="">All Agencies</option>
          {agencies.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="input-field sm:w-40"
        >
          <option value="">All Status</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        {/* View toggle */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white flex-shrink-0">
          <button
            onClick={() => toggleView('grid')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <GridIcon active={viewMode === 'grid'} />
            Grid
          </button>
          <button
            onClick={() => toggleView('table')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
              viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <ListIcon active={viewMode === 'table'} />
            Table
          </button>
        </div>
      </div>

      {/* Active filter pills */}
      {(search || agency || status) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {search && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
              "{search}"
              <button onClick={() => setSearch('')} className="hover:text-blue-900 ml-1">✕</button>
            </span>
          )}
          {agency && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
              Agency: {agency}
              <button onClick={() => setAgency('')} className="hover:text-blue-900 ml-1">✕</button>
            </span>
          )}
          {status && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
              Status: {status}
              <button onClick={() => setStatus('')} className="hover:text-blue-900 ml-1">✕</button>
            </span>
          )}
          <button
            onClick={() => { setSearch(''); setAgency(''); setStatus('') }}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Empty state */}
      {paginated.length === 0 && (
        <div className="card p-16 text-center text-slate-400">
          <div className="text-5xl mb-4">🔌</div>
          <div className="font-semibold text-slate-600">No consumers found</div>
          <div className="text-sm mt-1">Adjust your search or filters</div>
        </div>
      )}

      {/* Grid view */}
      {paginated.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map(c => (
            <ConsumerCard
              key={c.id}
              consumer={c}
              onUpdateStatus={setSelected}
            />
          ))}
        </div>
      )}

      {/* Table view */}
      {paginated.length > 0 && viewMode === 'table' && (
        <ConsumerTable consumers={paginated} onUpdateStatus={setSelected} />
      )}

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />

      {/* Status update modal */}
      {selected && (
        <StatusModal
          consumer={selected}
          onSave={handleStatusSave}
          onClose={() => setSelected(null)}
        />
      )}
    </Layout>
  )
}
