// src/components/Dashboard.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { fetchSheetData } from '../services/googleSheetsService'
import { parseFile, exportToCSV, exportToExcel } from '../services/fileParserService'
import styles from './Dashboard.module.css'

/* ── helpers ── */
const uid = () => `row_${Date.now()}_${Math.random().toString(36).slice(2)}`

const DEMO_ROWS = [
  { _id: uid(), Name: 'Arjun Sharma',   Phone: '9831012345', Plan: 'Gold',   Status: 'Active',       Amount: '₹2,499', Area: 'Kolkata North', Due: '2025-06-01' },
  { _id: uid(), Name: 'Priya Das',      Phone: '9830056789', Plan: 'Silver', Status: 'Disconnected', Amount: '₹1,299', Area: 'Salt Lake',      Due: '2025-05-15' },
  { _id: uid(), Name: 'Rohit Ghosh',    Phone: '9874123456', Plan: 'Bronze', Status: 'Pending',      Amount: '₹799',   Area: 'Howrah',        Due: '2025-05-20' },
  { _id: uid(), Name: 'Sneha Mukherjee',Phone: '9007654321', Plan: 'Gold',   Status: 'Active',       Amount: '₹2,499', Area: 'Park Street',   Due: '2025-06-05' },
  { _id: uid(), Name: 'Amit Bose',      Phone: '9433212345', Plan: 'Silver', Status: 'Active',       Amount: '₹1,299', Area: 'Jadavpur',      Due: '2025-06-10' },
  { _id: uid(), Name: 'Kavita Roy',     Phone: '9831099876', Plan: 'Bronze', Status: 'Disconnected', Amount: '₹799',   Area: 'Dum Dum',       Due: '2025-05-01' },
  { _id: uid(), Name: 'Suresh Pal',     Phone: '9830011223', Plan: 'Gold',   Status: 'Pending',      Amount: '₹2,499', Area: 'Barasat',       Due: '2025-05-25' },
  { _id: uid(), Name: 'Meera Sen',      Phone: '9874456789', Plan: 'Silver', Status: 'Active',       Amount: '₹1,299', Area: 'Garia',         Due: '2025-06-15' },
]

const STATUS_COLOR = { Active: '#22c55e', Disconnected: '#ef4444', Pending: '#f59e0b' }
const PLAN_COLOR   = { Gold: '#f59e0b', Silver: '#94a3b8', Bronze: '#b45309' }

export default function Dashboard() {
  /* ── state ── */
  const [source, setSource]         = useState('demo') // 'demo' | 'sheets' | 'file'
  const [rows, setRows]             = useState(DEMO_ROWS)
  const [columns, setColumns]       = useState(Object.keys(DEMO_ROWS[0]).filter(k => k !== '_id'))
  const [editCell, setEditCell]     = useState(null)   // { rowId, col }
  const [editVal, setEditVal]       = useState('')
  const [deletedRows, setDeletedRows] = useState([])   // for undo
  const [search, setSearch]         = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortCol, setSortCol]       = useState(null)
  const [sortDir, setSortDir]       = useState('asc')
  const [sheetsLoading, setSheetsLoading] = useState(false)
  const [sheetsError, setSheetsError]     = useState('')
  const [fileInfo, setFileInfo]     = useState(null)    // { name, size }
  const [dragOver, setDragOver]     = useState(false)
  const [showAddModal, setShowAddModal]   = useState(false)
  const [newRow, setNewRow]         = useState({})
  const [toast, setToast]           = useState(null)
  const [fileName, setFileName]     = useState('')

  const fileInputRef = useRef(null)
  const editInputRef = useRef(null)

  /* ── toast helper ── */
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  /* ── focus edit input when cell activates ── */
  useEffect(() => {
    if (editCell && editInputRef.current) editInputRef.current.focus()
  }, [editCell])

  /* ── derived stats ── */
  const stats = React.useMemo(() => {
    const total  = rows.length
    const disconnected = rows.filter(r => r.Status === 'Disconnected').length
    const pending      = rows.filter(r => r.Status === 'Pending').length
    const active       = rows.filter(r => r.Status === 'Active').length
    const revenue = rows.reduce((sum, r) => {
      const n = parseFloat(String(r.Amount || '').replace(/[₹,]/g, '')) || 0
      return sum + n
    }, 0)
    return { total, disconnected, pending, active, revenue }
  }, [rows])

  /* ── filtered + sorted rows ── */
  const visibleRows = React.useMemo(() => {
    let data = [...rows]
    if (filterStatus !== 'All') data = data.filter(r => r.Status === filterStatus)
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(q))
      )
    }
    if (sortCol) {
      data.sort((a, b) => {
        const av = String(a[sortCol] ?? '').toLowerCase()
        const bv = String(b[sortCol] ?? '').toLowerCase()
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    }
    return data
  }, [rows, filterStatus, search, sortCol, sortDir])

  /* ── Google Sheets load ── */
  const loadSheets = async () => {
    setSheetsLoading(true); setSheetsError('')
    try {
      const data = await fetchSheetData()
      if (!data.length) throw new Error('No data returned from Google Sheets')
      setRows(data)
      setColumns(Object.keys(data[0]).filter(k => k !== '_id'))
      setSource('sheets')
      showToast(`Loaded ${data.length} rows from Google Sheets`)
    } catch (e) {
      setSheetsError(e.message)
      showToast(e.message, 'error')
    } finally {
      setSheetsLoading(false)
    }
  }

  /* ── file parse ── */
  const handleFile = async (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      showToast('Only .csv, .xlsx or .xls files allowed', 'error'); return
    }
    try {
      const { rows: parsed, sheetNames } = await parseFile(file)
      setRows(parsed)
      setColumns(Object.keys(parsed[0]).filter(k => k !== '_id'))
      setSource('file')
      setFileInfo({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', sheets: sheetNames })
      showToast(`Loaded ${parsed.length} rows from ${file.name}`)
    } catch (e) {
      showToast('Failed to parse file: ' + e.message, 'error')
    }
  }

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const onFileInput = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  /* ── inline edit ── */
  const startEdit = (rowId, col, val) => {
    setEditCell({ rowId, col }); setEditVal(val)
  }

  const commitEdit = () => {
    if (!editCell) return
    setRows(prev => prev.map(r =>
      r._id === editCell.rowId ? { ...r, [editCell.col]: editVal } : r
    ))
    setEditCell(null)
  }

  /* ── delete / undo ── */
  const deleteRow = (rowId) => {
    const row = rows.find(r => r._id === rowId)
    setDeletedRows(prev => [row, ...prev])
    setRows(prev => prev.filter(r => r._id !== rowId))
    showToast('Row deleted — click Undo to restore')
  }

  const undoAll = () => {
    setRows(prev => [...prev, ...deletedRows])
    setDeletedRows([])
    showToast('All deletions restored')
  }

  /* ── add row ── */
  const openAddModal = () => {
    const blank = {}; columns.forEach(c => { blank[c] = '' })
    setNewRow(blank); setShowAddModal(true)
  }

  const submitAddRow = () => {
    const row = { _id: uid(), ...newRow }
    setRows(prev => [row, ...prev])
    setShowAddModal(false)
    showToast('New consumer added')
  }

  /* ── sort toggle ── */
  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  /* ── export ── */
  const doExport = (type) => {
    const name = fileName || (source === 'file' ? fileInfo?.name?.replace(/\.\w+$/, '') : 'consumers')
    if (type === 'csv') exportToCSV(visibleRows, `${name}.csv`)
    else exportToExcel(visibleRows, `${name}.xlsx`)
  }

  /* ── use demo data ── */
  const useDemoData = () => {
    setRows(DEMO_ROWS)
    setColumns(Object.keys(DEMO_ROWS[0]).filter(k => k !== '_id'))
    setSource('demo'); setFileInfo(null)
    showToast('Loaded demo data')
  }

  return (
    <div className={styles.shell}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>⚡</div>
          <div>
            <div className={styles.logoTitle}>Admin Console</div>
            <div className={styles.logoBadge}>
              {source === 'demo' ? 'Demo Data' : source === 'sheets' ? '🔗 Google Sheets' : `📂 ${fileInfo?.name}`}
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnGhost} onClick={() => fileInputRef.current?.click()}>
            📤 Upload File
          </button>
          <button className={styles.btnAccent} onClick={loadSheets} disabled={sheetsLoading}>
            {sheetsLoading ? '⏳ Loading…' : '🔗 Sync Sheets'}
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {/* ── SIDEBAR ── */}
        <aside className={styles.sidebar}>
          {/* Stats */}
          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>Overview</div>
            <StatCard label="Total Consumers" value={stats.total} icon="👥" color="#4f6ef7" />
            <StatCard label="Active"           value={stats.active} icon="✅" color="#22c55e" />
            <StatCard label="Disconnected"     value={stats.disconnected} icon="🔴" color="#ef4444" />
            <StatCard label="Pending"          value={stats.pending} icon="⏳" color="#f59e0b" />
            <StatCard label="Total Revenue"    value={`₹${(stats.revenue/1000).toFixed(1)}K`} icon="💰" color="#a78bfa" big />
          </div>

          {/* ── UPLOAD ZONE ── ALWAYS VISIBLE ── */}
          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>Data Source</div>
            <div
              className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.dropIcon}>📂</div>
              <div className={styles.dropLabel}>Drop .csv / .xlsx / .xls</div>
              <div className={styles.dropSub}>or click to browse</div>
              {fileInfo && (
                <div className={styles.fileChip}>
                  ✓ {fileInfo.name} ({fileInfo.size})
                </div>
              )}
            </div>
            <input
              ref={fileInputRef} type="file"
              accept=".csv,.xlsx,.xls"
              style={{ display: 'none' }}
              onChange={onFileInput}
            />

            {/* Google Sheets */}
            <button className={styles.sourceBtn} onClick={loadSheets} disabled={sheetsLoading}>
              🔗 {sheetsLoading ? 'Loading Sheets…' : 'Load Google Sheets'}
            </button>
            <button className={styles.sourceBtnGhost} onClick={useDemoData}>
              🎲 Reset to Demo Data
            </button>

            {sheetsError && <div className={styles.errorBox}>⚠ {sheetsError}</div>}
          </div>

          {/* Export */}
          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>Export</div>
            <div className={styles.exportRow}>
              <input
                className={styles.fileNameInput}
                placeholder="filename (optional)"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
              />
            </div>
            <button className={styles.exportBtn} onClick={() => doExport('csv')}>⬇ Export CSV</button>
            <button className={styles.exportBtn} onClick={() => doExport('xlsx')}>⬇ Export Excel</button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className={styles.main}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                className={styles.search}
                placeholder="Search consumers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.filters}>
              {['All', 'Active', 'Pending', 'Disconnected'].map(s => (
                <button
                  key={s}
                  className={`${styles.filterBtn} ${filterStatus === s ? styles.filterBtnActive : ''}`}
                  onClick={() => setFilterStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className={styles.toolbarRight}>
              {deletedRows.length > 0 && (
                <button className={styles.undoBtn} onClick={undoAll}>
                  ↩ Undo ({deletedRows.length})
                </button>
              )}
              <button className={styles.addBtn} onClick={openAddModal}>➕ Add Consumer</button>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col} className={styles.th} onClick={() => toggleSort(col)}>
                      {col}
                      {sortCol === col && <span className={styles.sortArrow}>{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>}
                    </th>
                  ))}
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 && (
                  <tr><td colSpan={columns.length + 1} className={styles.emptyCell}>No records found</td></tr>
                )}
                {visibleRows.map(row => (
                  <tr key={row._id} className={styles.tr}>
                    {columns.map(col => {
                      const isEditing = editCell?.rowId === row._id && editCell?.col === col
                      return (
                        <td key={col} className={styles.td}>
                          {isEditing ? (
                            <input
                              ref={editInputRef}
                              className={styles.inlineInput}
                              value={editVal}
                              onChange={e => setEditVal(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={e => { if (e.key === 'Enter') commitEdit() }}
                            />
                          ) : (
                            <span
                              className={styles.cellVal}
                              onClick={() => startEdit(row._id, col, row[col])}
                              title="Click to edit"
                            >
                              {col === 'Status' ? (
                                <span className={styles.badge} style={{ '--bc': STATUS_COLOR[row[col]] || '#6b7280' }}>
                                  {row[col]}
                                </span>
                              ) : col === 'Plan' ? (
                                <span className={styles.planBadge} style={{ '--pc': PLAN_COLOR[row[col]] || '#6b7280' }}>
                                  {row[col]}
                                </span>
                              ) : (
                                row[col] || <span className={styles.empty}>—</span>
                              )}
                            </span>
                          )}
                        </td>
                      )
                    })}
                    <td className={styles.td}>
                      <button className={styles.deleteBtn} onClick={() => deleteRow(row._id)} title="Delete row">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.tableFooter}>
            Showing {visibleRows.length} of {rows.length} consumers
          </div>
        </main>
      </div>

      {/* ── ADD ROW MODAL ── */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalTitle}>➕ Add New Consumer</div>
            <div className={styles.modalFields}>
              {columns.map(col => (
                <label key={col} className={styles.fieldLabel}>
                  <span>{col}</span>
                  <input
                    className={styles.fieldInput}
                    value={newRow[col] || ''}
                    onChange={e => setNewRow(prev => ({ ...prev, [col]: e.target.value }))}
                    placeholder={`Enter ${col}`}
                  />
                </label>
              ))}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.btnGhost} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className={styles.btnAccent} onClick={submitAddRow}>Add Consumer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.type === 'error' ? '⚠ ' : '✓ '}{toast.msg}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, color, big }) {
  return (
    <div className={styles.statCard} style={{ '--sc': color }}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <div className={`${styles.statValue} ${big ? styles.statBig : ''}`}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  )
}
