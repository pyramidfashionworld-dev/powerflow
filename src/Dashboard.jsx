/**
 * Dashboard.jsx
 * PowerFlow Admin Dashboard
 * — Google Sheets live data source
 * — CSV / Excel upload with column mapping
 * — Inline row editing
 * — Export to CSV or XLSX
 * — Add / delete rows
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  fetchConsumersFromSheet,
  getAgenciesFromConsumers,
} from '../services/googleSheetsService'
import {
  parseUploadedFile,
  exportToCSV,
  exportToXLSX,
} from '../services/fileParserService'
import s from './Dashboard.module.css'

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE   = 25
const STATUS_META = {
  connected:    { label: 'Connected',    color: '#00e676' },
  pending:      { label: 'Pending',      color: '#ffca28' },
  disconnected: { label: 'Disconnected', color: '#ff4d4d' },
}

const BLANK_CONSUMER = {
  consumerId:'', name:'', address:'', billingCategory:'',
  meterCode:'', dueDateRange:'', outstandingDues:0, mobile:'', agency:'',
}

// ─── Small UI atoms ───────────────────────────────────────────────────────────
function Badge({ status }) {
  const m = STATUS_META[status] || STATUS_META.connected
  return (
    <span className={s.badge} style={{ '--c': m.color }}>
      <span className={s.dot} />{m.label}
    </span>
  )
}

function StatCard({ label, value, color, sub }) {
  return (
    <div className={s.statCard} style={{ '--a': color }}>
      <div className={s.statVal}>{value}</div>
      <div className={s.statLbl}>{label}</div>
      {sub && <div className={s.statSub}>{sub}</div>}
    </div>
  )
}

function Spinner() {
  return <div className={s.spinner} />
}

// ─── File upload drop zone ────────────────────────────────────────────────────
function UploadZone({ onFile, loading }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  function handleDrop(e) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      className={`${s.dropZone} ${dragging ? s.dropping : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]); e.target.value = '' }}
      />
      {loading ? (
        <><Spinner /><p className={s.dropText}>Parsing file…</p></>
      ) : (
        <>
          <div className={s.dropIcon}>📂</div>
          <p className={s.dropTitle}>Drop your Excel or CSV file here</p>
          <p className={s.dropText}>Supports .xlsx, .xls, .csv — click or drag & drop</p>
          <div className={s.dropHint}>
            Required columns: <code>consumerId, name, address, billingCategory,
            meterCode, outstandingDues, mobile, agency</code>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Inline-editable cell ─────────────────────────────────────────────────────
function EditCell({ value, field, type = 'text', onSave }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal]         = useState(value)
  const inputRef              = useRef()

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  function commit() { setEditing(false); if (String(val) !== String(value)) onSave(val) }

  if (!editing) {
    return (
      <span className={s.editCell} onClick={() => { setVal(value); setEditing(true) }}>
        {field === 'outstandingDues'
          ? `₹${Number(value).toLocaleString('en-IN')}`
          : value || <em className={s.empty}>—</em>}
        <span className={s.editIcon}>✎</span>
      </span>
    )
  }

  return (
    <input
      ref={inputRef}
      className={s.editInput}
      type={type}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
    />
  )
}

// ─── Add new consumer modal ───────────────────────────────────────────────────
function AddModal({ onAdd, onClose }) {
  const [form, setForm] = useState(BLANK_CONSUMER)

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  function handleSubmit() {
    if (!form.consumerId.trim() || !form.name.trim()) return
    const dues = parseFloat(form.outstandingDues)||0
    onAdd({
      ...form,
      id:              form.consumerId.trim(),
      name:            form.name.trim().toUpperCase(),
      outstandingDues: dues,
      phaseClass:      phaseClass(form.billingCategory),
      deviceId:        `DEV-${form.consumerId.replace(/\D/g,'').slice(-4)}`,
      status:          dues>5000?'disconnected':dues>0?'pending':'connected',
    })
    onClose()
  }

  function phaseClass(bc) {
    const s = String(bc||'').toUpperCase()
    return s.includes('3')?'3-Phase':s.includes('2')?'2-Phase':'1-Phase'
  }

  const fields = [
    { key:'consumerId',      label:'Consumer ID *',    type:'text' },
    { key:'name',            label:'Name *',           type:'text' },
    { key:'address',         label:'Address',          type:'text' },
    { key:'billingCategory', label:'Billing Category', type:'text' },
    { key:'meterCode',       label:'Meter Code',       type:'text' },
    { key:'dueDateRange',    label:'Due Date Range',   type:'text' },
    { key:'outstandingDues', label:'Outstanding Dues', type:'number' },
    { key:'mobile',          label:'Mobile',           type:'text' },
    { key:'agency',          label:'Agency',           type:'text' },
  ]

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <div className={s.modalHead}>
          <h2 className={s.modalTitle}>➕ Add New Consumer</h2>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={s.modalBody}>
          <div className={s.formGrid}>
            {fields.map(f => (
              <label key={f.key} className={s.formLabel}>
                <span>{f.label}</span>
                <input
                  className={s.formInput}
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.label}
                />
              </label>
            ))}
          </div>
        </div>
        <div className={s.modalFoot}>
          <button className={s.btnSecondary} onClick={onClose}>Cancel</button>
          <button
            className={s.btnPrimary}
            onClick={handleSubmit}
            disabled={!form.consumerId.trim() || !form.name.trim()}
          >
            Add Consumer
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Detail view modal ────────────────────────────────────────────────────────
function DetailModal({ consumer, onClose }) {
  if (!consumer) return null
  const fields = [
    ['Consumer ID', consumer.consumerId],
    ['Device ID',   consumer.deviceId],
    ['Address',     consumer.address],
    ['Category',    consumer.billingCategory],
    ['Phase',       consumer.phaseClass],
    ['Meter Code',  consumer.meterCode],
    ['Mobile',      consumer.mobile || '—'],
    ['Agency',      consumer.agency || '—'],
    ['Due Range',   consumer.dueDateRange || '—'],
    ['Outstanding', `₹${(consumer.outstandingDues||0).toLocaleString('en-IN')}`],
  ]
  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div className={s.modalHead}>
          <h2 className={s.modalTitle}>{consumer.name}</h2>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={s.modalBody}>
          <div className={s.detailGrid}>
            {fields.map(([l, v]) => (
              <div key={l} className={s.detailItem}>
                <span className={s.detailLbl}>{l}</span>
                <span className={s.detailVal}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={s.modalFoot}>
          <Badge status={consumer.status} />
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  // Data sources
  const [sheetConsumers,  setSheetConsumers]  = useState([])
  const [uploadConsumers, setUploadConsumers] = useState([])
  const [editedRows,      setEditedRows]      = useState({})   // id → overrides
  const [deletedIds,      setDeletedIds]      = useState(new Set())

  // UI state
  const [tab,           setTab]           = useState('sheet')  // 'sheet' | 'upload'
  const [sheetLoading,  setSheetLoading]  = useState(false)
  const [sheetError,    setSheetError]    = useState(null)
  const [fileLoading,   setFileLoading]   = useState(false)
  const [fileError,     setFileError]     = useState(null)
  const [uploadedName,  setUploadedName]  = useState(null)

  // Filters & sorting
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAgency, setFilterAgency] = useState('all')
  const [filterPhase,  setFilterPhase]  = useState('all')
  const [sortField,    setSortField]    = useState('name')
  const [sortDir,      setSortDir]      = useState('asc')
  const [page,         setPage]         = useState(1)

  // Modals
  const [selectedRow, setSelectedRow] = useState(null)
  const [showAdd,     setShowAdd]     = useState(false)

  const fileInputRef = useRef()

  // ── Load Google Sheet ───────────────────────────────────────────────────────
  const loadSheet = useCallback(async (force = false) => {
    setSheetLoading(true); setSheetError(null)
    try {
      const data = await fetchConsumersFromSheet()
      if (!data.length && !force) setSheetError('No data returned. Check your .env and Sheet visibility.')
      setSheetConsumers(data)
    } catch (err) {
      setSheetError(`Failed: ${err.message}`)
    } finally {
      setSheetLoading(false)
    }
  }, [])

  useEffect(() => { loadSheet() }, [loadSheet])

  // ── Handle file upload ──────────────────────────────────────────────────────
  async function handleFile(file) {
    setFileLoading(true); setFileError(null)
    const { consumers, error } = await parseUploadedFile(file)
    setFileLoading(false)
    if (error) { setFileError(error); return }
    setUploadConsumers(consumers)
    setUploadedName(file.name)
    setTab('upload')
    setEditedRows({})
    setDeletedIds(new Set())
    setPage(1)
  }

  // ── Active consumers (source + edits + deletions + adds) ───────────────────
  const baseConsumers = tab === 'sheet' ? sheetConsumers : uploadConsumers

  const activeConsumers = useMemo(() => {
    return baseConsumers
      .filter(c => !deletedIds.has(c.id))
      .map(c => {
        const overrides = editedRows[c.id]
        if (!overrides) return c
        const merged = { ...c, ...overrides }
        const dues   = parseFloat(merged.outstandingDues)||0
        const bc     = String(merged.billingCategory||'').toUpperCase()
        merged.status     = dues>5000?'disconnected':dues>0?'pending':'connected'
        merged.phaseClass = bc.includes('3')?'3-Phase':bc.includes('2')?'2-Phase':'1-Phase'
        return merged
      })
  }, [baseConsumers, editedRows, deletedIds])

  // ── Edit a cell ─────────────────────────────────────────────────────────────
  function editCell(id, field, value) {
    setEditedRows(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }))
  }

  // ── Delete row ──────────────────────────────────────────────────────────────
  function deleteRow(id) {
    setDeletedIds(prev => new Set([...prev, id]))
  }

  // ── Add row ─────────────────────────────────────────────────────────────────
  function addRow(consumer) {
    if (tab === 'sheet') setSheetConsumers(prev => [consumer, ...prev])
    else setUploadConsumers(prev => [consumer, ...prev])
  }

  // ── Undo deletions ──────────────────────────────────────────────────────────
  function undoAll() { setEditedRows({}); setDeletedIds(new Set()) }

  // ── Agencies ────────────────────────────────────────────────────────────────
  const agencies = useMemo(() => getAgenciesFromConsumers(activeConsumers), [activeConsumers])

  // ── Filtered + sorted ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...activeConsumers]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.consumerId.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.mobile.includes(q)
      )
    }
    if (filterStatus !== 'all') list = list.filter(c => c.status === filterStatus)
    if (filterAgency !== 'all') list = list.filter(c => c.agency === filterAgency)
    if (filterPhase  !== 'all') list = list.filter(c => c.phaseClass === filterPhase)

    list.sort((a, b) => {
      let va = a[sortField] ?? '', vb = b[sortField] ?? ''
      if (sortField === 'outstandingDues') { va = +va; vb = +vb }
      else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase() }
      return va < vb ? (sortDir==='asc'?-1:1) : va > vb ? (sortDir==='asc'?1:-1) : 0
    })
    return list
  }, [activeConsumers, search, filterStatus, filterAgency, filterPhase, sortField, sortDir])

  useEffect(() => setPage(1), [search, filterStatus, filterAgency, filterPhase, tab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  // Stats
  const stats = useMemo(() => ({
    total:        activeConsumers.length,
    connected:    activeConsumers.filter(c=>c.status==='connected').length,
    pending:      activeConsumers.filter(c=>c.status==='pending').length,
    disconnected: activeConsumers.filter(c=>c.status==='disconnected').length,
    dues:         activeConsumers.reduce((s,c)=>s+(c.outstandingDues||0),0),
  }), [activeConsumers])

  const pendingEdits = Object.keys(editedRows).length + deletedIds.size

  function thClick(field) {
    if (sortField === field) setSortDir(d => d==='asc'?'desc':'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  function SortIco({ f }) {
    if (sortField!==f) return <span className={s.sortN}>↕</span>
    return <span className={s.sortA}>{sortDir==='asc'?'↑':'↓'}</span>
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={s.page}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className={s.header}>
        <div className={s.headerBrand}>
          <span className={s.logo}>⚡ PowerFlow</span>
          <span className={s.logoSub}>Admin Dashboard</span>
        </div>

        <div className={s.headerActions}>
          {/* Upload button always visible */}
          <label className={s.uploadBtn}>
            📤 Upload File
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              style={{ display:'none' }}
              onChange={e => { if(e.target.files[0]) handleFile(e.target.files[0]); e.target.value='' }}
            />
          </label>

          <button
            className={s.btnOutline}
            onClick={() => exportToCSV(activeConsumers)}
            disabled={!activeConsumers.length}
          >
            ⬇ CSV
          </button>
          <button
            className={s.btnOutline}
            onClick={() => exportToXLSX(activeConsumers)}
            disabled={!activeConsumers.length}
          >
            ⬇ Excel
          </button>
          <button
            className={s.btnPrimary}
            onClick={() => setShowAdd(true)}
          >
            ＋ Add
          </button>
        </div>
      </header>

      {/* ── SOURCE TABS ────────────────────────────────────────────── */}
      <div className={s.tabBar}>
        <button
          className={`${s.tabBtn} ${tab==='sheet'?s.tabActive:''}`}
          onClick={() => setTab('sheet')}
        >
          🔗 Google Sheets
          {sheetConsumers.length > 0 && (
            <span className={s.tabCount}>{sheetConsumers.length}</span>
          )}
        </button>
        <button
          className={`${s.tabBtn} ${tab==='upload'?s.tabActive:''}`}
          onClick={() => tab==='sheet' && setTab('upload')}
        >
          📂 Uploaded File
          {uploadedName && (
            <span className={s.tabCount}>{uploadConsumers.length}</span>
          )}
        </button>

        {tab==='sheet' && (
          <button
            className={s.refreshBtn}
            onClick={() => loadSheet(true)}
            disabled={sheetLoading}
          >
            {sheetLoading ? '⟳ Loading…' : '⟳ Refresh Sheet'}
          </button>
        )}

        {pendingEdits > 0 && (
          <div className={s.editBadge}>
            {pendingEdits} unsaved change{pendingEdits>1?'s':''}
            <button className={s.undoBtn} onClick={undoAll}>Undo all</button>
          </div>
        )}

        {uploadedName && tab==='upload' && (
          <span className={s.fileName}>📄 {uploadedName}</span>
        )}
      </div>

      {/* ── UPLOAD ZONE (when no file yet and on upload tab) ───────── */}
      {tab === 'upload' && !uploadConsumers.length && (
        <div className={s.uploadSection}>
          <UploadZone onFile={handleFile} loading={fileLoading} />
          {fileError && <div className={s.errBox}>⚠ {fileError}</div>}
        </div>
      )}

      {/* ── SHEET ERROR ─────────────────────────────────────────────── */}
      {tab==='sheet' && sheetError && (
        <div className={s.errBox} style={{ margin:'16px 28px' }}>
          ⚠ {sheetError}
          <small style={{ display:'block', marginTop:6, opacity:.7 }}>
            Make sure your .env has VITE_GOOGLE_SHEET_ID and VITE_GOOGLE_API_KEY,
            and the sheet is set to "Anyone with link can view".
          </small>
        </div>
      )}

      {/* ── LOADING ─────────────────────────────────────────────────── */}
      {sheetLoading && tab==='sheet' && (
        <div className={s.loadBox}><Spinner /><p>Fetching from Google Sheets…</p></div>
      )}

      {/* ── STATS ───────────────────────────────────────────────────── */}
      {activeConsumers.length > 0 && (
        <div className={s.stats}>
          <StatCard label="Total"        value={stats.total}        color="#00d4ff" />
          <StatCard label="Connected"    value={stats.connected}    color="#00e676" />
          <StatCard label="Pending"      value={stats.pending}      color="#ffca28" />
          <StatCard label="Disconnected" value={stats.disconnected} color="#ff4d4d" />
          <StatCard
            label="Total Dues"
            value={`₹${stats.dues.toLocaleString('en-IN')}`}
            color="#ff9800"
          />
        </div>
      )}

      {/* ── FILTERS ─────────────────────────────────────────────────── */}
      {activeConsumers.length > 0 && (
        <div className={s.filters}>
          <input
            className={s.searchInput}
            type="text"
            placeholder="Search name, ID, address, mobile…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className={s.sel} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="connected">Connected</option>
            <option value="pending">Pending</option>
            <option value="disconnected">Disconnected</option>
          </select>
          <select className={s.sel} value={filterPhase} onChange={e=>setFilterPhase(e.target.value)}>
            <option value="all">All Phases</option>
            <option value="1-Phase">1-Phase</option>
            <option value="2-Phase">2-Phase</option>
            <option value="3-Phase">3-Phase</option>
          </select>
          <select className={s.sel} value={filterAgency} onChange={e=>setFilterAgency(e.target.value)}>
            <option value="all">All Agencies</option>
            {agencies.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <span className={s.resultCount}>{filtered.length} result{filtered.length!==1?'s':''}</span>
        </div>
      )}

      {/* ── UPLOAD ZONE in table area when upload tab + file uploaded ─ */}
      {tab === 'upload' && uploadConsumers.length > 0 && (
        <div className={s.reuploadRow}>
          <label className={s.reuploadBtn}>
            🔄 Replace file
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              style={{ display:'none' }}
              onChange={e => { if(e.target.files[0]) handleFile(e.target.files[0]); e.target.value='' }}
            />
          </label>
        </div>
      )}

      {/* ── TABLE ───────────────────────────────────────────────────── */}
      {activeConsumers.length > 0 && (
        <>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  {[
                    ['consumerId','Consumer ID'],['name','Name'],['address','Address'],
                    ['billingCategory','Category'],['phaseClass','Phase'],
                    ['meterCode','Meter Code'],['outstandingDues','Dues (₹)'],
                    ['mobile','Mobile'],['agency','Agency'],['status','Status'],
                  ].map(([f, label]) => (
                    <th key={f} className={s.th} onClick={() => thClick(f)}>
                      {label} <SortIco f={f} />
                    </th>
                  ))}
                  <th className={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={11} className={s.emptyRow}>No results match your filters.</td>
                  </tr>
                ) : paginated.map(c => (
                  <tr key={c.id} className={s.row}>
                    <td className={s.td}>
                      <EditCell value={c.consumerId} field="consumerId"
                        onSave={v => editCell(c.id,'consumerId',v)} />
                    </td>
                    <td className={s.td}>
                      <EditCell value={c.name} field="name"
                        onSave={v => editCell(c.id,'name',v.toUpperCase())} />
                    </td>
                    <td className={s.td} style={{ maxWidth:180 }}>
                      <EditCell value={c.address} field="address"
                        onSave={v => editCell(c.id,'address',v)} />
                    </td>
                    <td className={s.td}>
                      <EditCell value={c.billingCategory} field="billingCategory"
                        onSave={v => editCell(c.id,'billingCategory',v)} />
                    </td>
                    <td className={s.td}>{c.phaseClass}</td>
                    <td className={s.td}>
                      <EditCell value={c.meterCode} field="meterCode"
                        onSave={v => editCell(c.id,'meterCode',v)} />
                    </td>
                    <td className={s.td}>
                      <EditCell value={c.outstandingDues} field="outstandingDues" type="number"
                        onSave={v => editCell(c.id,'outstandingDues',parseFloat(v)||0)} />
                    </td>
                    <td className={s.td}>
                      <EditCell value={c.mobile} field="mobile"
                        onSave={v => editCell(c.id,'mobile',v)} />
                    </td>
                    <td className={s.td}>
                      <EditCell value={c.agency} field="agency"
                        onSave={v => editCell(c.id,'agency',v)} />
                    </td>
                    <td className={s.td}><Badge status={c.status} /></td>
                    <td className={s.td}>
                      <div className={s.rowActions}>
                        <button className={s.viewBtn} onClick={() => setSelectedRow(c)}
                          title="View details">👁</button>
                        <button className={s.delBtn}  onClick={() => deleteRow(c.id)}
                          title="Delete row">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={s.pagination}>
              <button className={s.pageBtn} onClick={() => setPage(1)} disabled={page===1}>«</button>
              <button className={s.pageBtn} onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>‹ Prev</button>
              <span className={s.pageInfo}>Page {page} / {totalPages}</span>
              <button className={s.pageBtn} onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next ›</button>
              <button className={s.pageBtn} onClick={() => setPage(totalPages)} disabled={page===totalPages}>»</button>
            </div>
          )}
        </>
      )}

      {/* ── MODALS ─────────────────────────────────────────────────── */}
      {showAdd    && <AddModal    onAdd={addRow}  onClose={() => setShowAdd(false)} />}
      {selectedRow && <DetailModal consumer={selectedRow} onClose={() => setSelectedRow(null)} />}
    </div>
  )
}
