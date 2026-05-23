import { useState, useRef, useMemo } from 'react'
import * as XLSX from 'xlsx'

/* ─── DEMO DATA ─────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2)
const AREAS = ['ROXY','MUKTI','LAIBAH','SA','BHAT']
const STATUSES = ['connected','disconnected','pending']
const PLANS = ['D -1 PHASE','D -3 PHASE','LT-1','LT-2']

const RAW = [
  {id:'301013411',qmr:'K4B58QMR',name:'SADEK .',address:'MOFIJUDDIN,MAHANANDAPUR,,MAHANANDAPURJAGANNATHPUR,MALDA,',mobile:'7738573655',ods:59618.37,area:'ROXY',device:'TA258686',cls:'D -1 PHASE',due:'18.05.2015-23.12.2025',status:'connected'},
  {id:'342412699',qmr:'K4B61QMR',name:'SARIFUDDIN',address:'IMARUDDIN,,NONATOR,MALLIKPARA,',mobile:'7029650056',ods:58691.84,area:'MUKTI',device:'L2534760',cls:'D -1 PHASE',due:'22.08.2022-16.03.2026',status:'connected'},
  {id:'342478954',qmr:'K4C31QMR',name:'RAFIQUL ALI',address:'S/OLT BASIRUDDIN,,VILL.PO DEBIGANJ,CHANCHAL MALDA,',mobile:'8967887277',ods:54266.60,area:'ROXY',device:'RG113992',cls:'D -1 PHASE',due:'13.05.2019-23.12.2025',status:'connected'},
  {id:'342320626',qmr:'K4C57QMR',name:'MAHABUB ALAM',address:'C/O.- SUFI ALAM,,VILL-SITALPUR,,PANISAILMALDA,',mobile:'7431984923',ods:52176.28,area:'LAIBAH',device:'RX445231',cls:'D -1 PHASE',due:'01.04.2018-15.11.2025',status:'connected'},
  {id:'301362583',qmr:'K4B58QMR',name:'SK NAJAM C/O,HAMED',address:'UTTAR BASANTAPUR,,UTTRA BASANTAPUR,MALDA,',mobile:'8670599073',ods:44039.69,area:'ROXY',device:'TQ998011',cls:'D -1 PHASE',due:'12.07.2016-30.09.2025',status:'connected'},
  {id:'342127840',qmr:'K4H32QMR',name:'SARAJUDDIN',address:'SARAJUDDIN,,VILL-SITALPUR,MALDA,',mobile:'9933441122',ods:41200.00,area:'SA',device:'BM334521',cls:'LT-1',due:'20.01.2020-10.08.2025',status:'disconnected'},
  {id:'301891234',qmr:'K4A11QMR',name:'RUHUL AMIN',address:'RUHUL AMIN,,PO KALIACHAK,MALDA,',mobile:'9800112233',ods:38750.50,area:'BHAT',device:'ZZ112234',cls:'D -1 PHASE',due:'05.03.2017-22.06.2025',status:'pending'},
  {id:'342556789',qmr:'K4D02QMR',name:'NASIM AKHTAR',address:'NASIM AKHTAR,,VILL ENGLISHBAZAR,MALDA,',mobile:'7001223344',ods:35100.75,area:'MUKTI',device:'QP554321',cls:'D -3 PHASE',due:'11.09.2021-14.02.2026',status:'disconnected'},
  {id:'301778901',qmr:'K4F44QMR',name:'AZIZUR RAHMAN',address:'AZIZUR RAHMAN,,NEAR COURT,MALDA,',mobile:'8100998877',ods:31400.00,area:'ROXY',device:'MN223311',cls:'LT-2',due:'30.06.2016-01.01.2026',status:'connected'},
  {id:'342334455',qmr:'K4G77QMR',name:'JAHANGIR ALAM',address:'JAHANGIR ALAM,,VILL GAZOLE,MALDA,',mobile:'9432110099',ods:28900.20,area:'SA',device:'AB667788',cls:'D -1 PHASE',due:'17.04.2019-28.10.2025',status:'pending'},
  {id:'301445566',qmr:'K4B90QMR',name:'HAMIDUR RAHMAN',address:'HAMIDUR RAHMAN,,VILL BAMONGRAM,MALDA,',mobile:'7550009988',ods:25600.00,area:'LAIBAH',device:'CD554433',cls:'D -1 PHASE',due:'03.08.2018-11.07.2025',status:'disconnected'},
  {id:'342667788',qmr:'K4C12QMR',name:'KAMAL HOSSAIN',address:'KAMAL HOSSAIN,,PO HARISHCHANDRAPUR,MALDA,',mobile:'9088776655',ods:22300.80,area:'ROXY',device:'EF001122',cls:'LT-1',due:'25.12.2020-09.04.2026',status:'connected'},
  {id:'301889900',qmr:'K4E55QMR',name:'BABUL SHEIKH',address:'BABUL SHEIKH,,VILL RATUA,MALDA,',mobile:'8001122334',ods:19750.40,area:'MUKTI',device:'GH223344',cls:'D -3 PHASE',due:'14.10.2017-17.03.2025',status:'connected'},
  {id:'342112233',qmr:'K4A33QMR',name:'MONOWAR HOSSAIN',address:'MONOWAR HOSSAIN,,VILL MOTHABARI,MALDA,',mobile:'9334455667',ods:17200.00,area:'BHAT',device:'IJ445566',cls:'D -1 PHASE',due:'08.02.2016-21.12.2025',status:'disconnected'},
  {id:'301556677',qmr:'K4D88QMR',name:'ALAUDDIN MONDAL',address:'ALAUDDIN MONDAL,,VILL CHANCHAL,MALDA,',mobile:'7700112233',ods:15800.60,area:'SA',device:'KL667788',cls:'LT-2',due:'19.07.2019-30.06.2025',status:'pending'},
  {id:'342778899',qmr:'K4F21QMR',name:'SIRAJUL ISLAM',address:'SIRAJUL ISLAM,,VILL MANIKCHAK,MALDA,',mobile:'8900223344',ods:13400.00,area:'ROXY',device:'MN889900',cls:'D -1 PHASE',due:'04.11.2020-25.11.2025',status:'connected'},
  {id:'301990011',qmr:'K4G54QMR',name:'RAFIQUE MONDAL',address:'RAFIQUE MONDAL,,VILL OLD MALDA,MALDA,',mobile:'9500334455',ods:11500.30,area:'LAIBAH',device:'OP001122',cls:'D -1 PHASE',due:'28.05.2021-18.05.2026',status:'connected'},
  {id:'342223344',qmr:'K4H67QMR',name:'IDRISH ALI',address:'IDRISH ALI,,VILL KALIACHAK,MALDA,',mobile:'7200445566',ods:9800.70,area:'MUKTI',device:'QR223344',cls:'LT-1',due:'15.01.2018-07.08.2025',status:'disconnected'},
  {id:'301334455',qmr:'K4A90QMR',name:'NURUL HAQUE',address:'NURUL HAQUE,,VILL BAISHNABNAGOR,MALDA,',mobile:'8600556677',ods:7600.00,area:'SA',device:'ST445566',cls:'D -3 PHASE',due:'09.08.2019-14.02.2026',status:'pending'},
  {id:'342445566',qmr:'K4B23QMR',name:'ABUL KASHEM',address:'ABUL KASHEM,,VILL GOUR,MALDA,',mobile:'9100667788',ods:5200.50,area:'BHAT',device:'UV667788',cls:'D -1 PHASE',due:'22.03.2022-01.12.2025',status:'connected'},
]

const CONSUMERS = RAW.map(r => ({ ...r, _id: uid() }))

const CREDS = {
  admin: { pass: 'admin123', name: 'Admin', role: 'admin' },
  user:  { pass: 'user123',  name: 'Field User', role: 'user' },
}

/* ─── HELPERS ───────────────────────────────────────────────── */
const STATUS_STYLE = {
  connected:    { bg:'#dcfce7', color:'#15803d', border:'#bbf7d0' },
  disconnected: { bg:'#fee2e2', color:'#dc2626', border:'#fecaca' },
  pending:      { bg:'#fef9c3', color:'#b45309', border:'#fef08a' },
}

function Badge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending
  return (
    <span style={{
      display:'inline-block', padding:'2px 10px', borderRadius:20,
      fontSize:12, fontWeight:600, border:`1px solid ${s.border}`,
      background:s.bg, color:s.color
    }}>{status}</span>
  )
}

function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        resolve(XLSX.utils.sheet_to_json(ws, { defval: '' }))
      } catch(err) { reject(err) }
    }
    reader.onerror = () => reject(new Error('Read failed'))
    reader.readAsArrayBuffer(file)
  })
}

function exportCSV(rows) {
  const keys = ['id','name','address','mobile','ods','area','status']
  const lines = [keys.join(','), ...rows.map(r => keys.map(k => `"${r[k] ?? ''}"`).join(','))]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'consumers.csv'; a.click()
}

/* ─── LOGIN PAGE ────────────────────────────────────────────── */
function LoginPage({ onLogin }) {
  const [tab, setTab] = useState('admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const submit = () => {
    setError('')
    const cred = CREDS[username.toLowerCase()]
    if (!cred || cred.pass !== password) { setError('Invalid username or password'); return }
    if (tab === 'admin' && cred.role !== 'admin') { setError('Not an admin account'); return }
    if (tab === 'user' && cred.role === 'admin') { setError('Use Admin login for this account'); return }
    onLogin({ name: cred.name, role: cred.role })
  }

  return (
    <div style={{
      minHeight:'100vh', background:'linear-gradient(135deg,#e8f0fe 0%,#f0f9ff 50%,#eff6ff 100%)',
      display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui,sans-serif'
    }}>
      <div style={{ width:420, background:'#fff', borderRadius:16, boxShadow:'0 8px 40px rgba(0,0,0,0.10)', overflow:'hidden' }}>
        {/* Header */}
        <div style={{ background:'#1d4ed8', padding:'28px 32px 20px', textAlign:'center' }}>
          <div style={{ fontSize:36, marginBottom:8 }}>⚡</div>
          <div style={{ color:'#fff', fontSize:20, fontWeight:700 }}>Powerflow</div>
          <div style={{ color:'rgba(255,255,255,0.7)', fontSize:13, marginTop:4 }}>Disconnection Management System</div>
        </div>
        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid #e5e7eb' }}>
          {['admin','user'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError('') }} style={{
              flex:1, padding:'14px 0', border:'none', cursor:'pointer', fontSize:14, fontWeight:600,
              background: tab === t ? '#fff' : '#f9fafb',
              color: tab === t ? '#1d4ed8' : '#6b7280',
              borderBottom: tab === t ? '2px solid #1d4ed8' : '2px solid transparent',
              transition:'all 0.15s'
            }}>
              {t === 'admin' ? '🔐 Admin Login' : '👤 User Login'}
            </button>
          ))}
        </div>
        {/* Form */}
        <div style={{ padding:'28px 32px 32px' }}>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>
              Username
            </label>
            <input
              value={username} onChange={e => setUsername(e.target.value)}
              placeholder={tab === 'admin' ? 'admin' : 'user'}
              style={{ width:'100%', padding:'10px 14px', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box' }}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:13, fontWeight:600, color:'#374151', display:'block', marginBottom:6 }}>
              Password
            </label>
            <div style={{ position:'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width:'100%', padding:'10px 40px 10px 14px', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, outline:'none', boxSizing:'border-box' }}
                onKeyDown={e => e.key === 'Enter' && submit()}
              />
              <button onClick={() => setShowPass(p => !p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:13 }}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          {error && <div style={{ background:'#fee2e2', border:'1px solid #fecaca', color:'#dc2626', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>⚠ {error}</div>}
          <button onClick={submit} style={{
            width:'100%', padding:'12px', background:'#1d4ed8', color:'#fff', border:'none',
            borderRadius:8, fontSize:15, fontWeight:600, cursor:'pointer'
          }}>
            Sign In →
          </button>
          <div style={{ marginTop:16, padding:'12px 14px', background:'#f0f9ff', borderRadius:8, fontSize:12, color:'#64748b' }}>
            <strong>Demo:</strong> admin / admin123 &nbsp;|&nbsp; user / user123
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── LAYOUT (shared nav) ───────────────────────────────────── */
function Layout({ user, page, setPage, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div style={{ minHeight:'100vh', background:'#f4f6fb', fontFamily:'system-ui,sans-serif' }}>
      {/* Top Nav */}
      <nav style={{
        position:'sticky', top:0, zIndex:100, background:'#fff',
        borderBottom:'1px solid #e5e7eb', display:'flex', alignItems:'center',
        justifyContent:'space-between', padding:'0 20px', height:56
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => setPage('home')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22 }}>🏠</button>
          {page !== 'home' && (
            <span style={{ fontSize:13, color:'#6b7280' }}>/ {PAGE_LABELS[page] || page}</span>
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <NavBtn icon="👤" label={user.name} />
          <NavBtn icon="⊞" onClick={() => setPage('home')} />
          <NavBtn icon="⬇" />
          <NavBtn icon="≡" />
          <NavBtn icon="⚙" onClick={() => setPage('admin')} />
          <NavBtn icon="↺" />
          <NavBtn icon="→|" onClick={onLogout} label="Logout" danger />
        </div>
      </nav>
      <div style={{ padding:'24px 28px' }}>{children}</div>
    </div>
  )
}

const PAGE_LABELS = { home:'Dashboard', disconnection:'Disconnection', reconnection:'Reconnection', deemed:'Deemed Visit', dtr:'DTR Management', nsc:'NSC Inspection', admin:'Admin Panel' }

function NavBtn({ icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={label}
      style={{
        display:'flex', alignItems:'center', gap:6, padding:'6px 10px',
        background: hov ? (danger ? '#fee2e2' : '#f0f4ff') : 'none',
        border:'none', borderRadius:6, cursor:'pointer', fontSize:15,
        color: danger ? '#dc2626' : '#374151', transition:'all 0.15s'
      }}
    >
      {icon}{label && <span style={{ fontSize:13, fontWeight:500 }}>{label}</span>}
    </button>
  )
}

/* ─── DASHBOARD HOME ────────────────────────────────────────── */
const MODULES = [
  { key:'disconnection', label:'Disconnection',  icon:'⚡', iconColor:'#ef4444', desc:'Manage disconnection lists & status', count:1701, active:true },
  { key:'reconnection',  label:'Reconnection',   icon:'↺',  iconColor:'#3b82f6', desc:'Re-issue connected consumers',       count:null, active:true },
  { key:'deemed',        label:'Deemed Visit',   icon:'👤', iconColor:'#f97316', desc:'View deemed disconnected consumers', count:476,  active:true },
  { key:'dtr',           label:'DTR Management', icon:'📡', iconColor:'#f97316', desc:'DTR inspections',                    count:null, active:true },
  { key:'nsc',           label:'NSC Inspection', icon:'📋', iconColor:'#22c55e', desc:'New Service Connection checks',      count:null, active:true },
  { key:'admin',         label:'Admin Panel',    icon:'⚙', iconColor:'#6b7280', desc:'Manage users and settings',          count:null, active:true },
]

function DashboardHome({ setPage }) {
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
        <span style={{ fontSize:28 }}>⊞</span>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:'#111827' }}>Dashboard</div>
          <div style={{ fontSize:14, color:'#6b7280' }}>Select a module to get started</div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
        {MODULES.map(m => (
          <ModuleCard key={m.key} mod={m} onClick={() => setPage(m.key)} />
        ))}
      </div>
    </div>
  )
}

function ModuleCard({ mod, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:'#fff', borderRadius:14, border:`1px solid ${hov ? '#bfdbfe' : '#e5e7eb'}`,
        padding:'24px 24px 20px', cursor:'pointer', position:'relative', overflow:'hidden',
        transition:'all 0.2s', boxShadow: hov ? '0 4px 20px rgba(59,130,246,0.10)' : 'none'
      }}
    >
      {/* Faded bg icon */}
      <div style={{ position:'absolute', right:-10, top:10, fontSize:90, opacity:0.07, userSelect:'none' }}>
        {mod.icon}
      </div>
      {/* Count badge */}
      {mod.count && (
        <div style={{
          position:'absolute', top:16, right:16, background:'#dc2626', color:'#fff',
          borderRadius:20, padding:'2px 10px', fontSize:12, fontWeight:700
        }}>{mod.count}</div>
      )}
      {/* Icon circle */}
      <div style={{
        width:44, height:44, borderRadius:12, background:`${mod.iconColor}18`,
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:16
      }}>{mod.icon}</div>
      <div style={{ fontSize:17, fontWeight:700, color: hov ? '#1d4ed8' : '#111827', marginBottom:8 }}>
        {mod.label}
      </div>
      <div style={{ fontSize:13, color:'#6b7280', marginBottom:16 }}>{mod.desc}</div>
      {mod.active && (
        <div style={{ fontSize:13, color:'#1d4ed8', fontWeight:600 }}>
          Access Module →
        </div>
      )}
    </div>
  )
}

/* ─── CONSUMER TABLE / CARD (shared) ────────────────────────── */
function ConsumerPage({ title, icon, data, setPage }) {
  const [view, setView] = useState('list')    // 'list' | 'card'
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editId, setEditId] = useState(null)
  const [rows, setRows] = useState(data)
  const [sort, setSort] = useState({ col:null, dir:'asc' })
  const [deleted, setDeleted] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [toast, setToast] = useState(null)
  const fileRef = useRef()

  const showToast = (msg, type='ok') => { setToast({msg,type}); setTimeout(()=>setToast(null),2500) }

  const filtered = useMemo(() => {
    let d = [...rows]
    if (filterStatus !== 'all') d = d.filter(r => r.status === filterStatus)
    if (search.trim()) {
      const q = search.toLowerCase()
      d = d.filter(r => [r.id,r.name,r.mobile,r.address,r.area].some(v => String(v).toLowerCase().includes(q)))
    }
    if (sort.col) {
      d.sort((a,b) => {
        const av = String(a[sort.col]??'').toLowerCase(), bv = String(b[sort.col]??'').toLowerCase()
        return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    }
    return d
  }, [rows, filterStatus, search, sort])

  const toggleSort = col => setSort(s => s.col === col ? { col, dir: s.dir==='asc'?'desc':'asc' } : { col, dir:'asc' })

  const deleteRow = id => {
    const r = rows.find(x => x._id === id)
    setDeleted(p => [r, ...p])
    setRows(p => p.filter(x => x._id !== id))
    showToast('Consumer deleted')
  }
  const undoAll = () => { setRows(p => [...p, ...deleted]); setDeleted([]); showToast('Restored') }

  const openEdit = r => { setEditRow({...r}); setShowModal(true) }
  const saveEdit = () => {
    setRows(p => p.map(r => r._id === editRow._id ? editRow : r))
    setShowModal(false); showToast('Updated successfully')
  }
  const addNew = () => {
    setEditRow({ _id: uid(), id:'', qmr:'', name:'', address:'', mobile:'', ods:0, area:'ROXY', device:'', cls:'D -1 PHASE', due:'', status:'connected' })
    setShowModal(true)
  }
  const submitNew = () => {
    setRows(p => [editRow, ...p])
    setShowModal(false); showToast('Consumer added')
  }
  const isNew = () => editRow && !rows.find(r => r._id === editRow._id)

  const onFile = async e => {
    const file = e.target.files[0]; if (!file) return
    try {
      const json = await parseFile(file)
      const mapped = json.map(r => ({ _id:uid(), id:String(r.ID||r.id||''), qmr:String(r.QMR||r.qmr||''), name:String(r.Name||r.name||''), address:String(r.Address||r.address||''), mobile:String(r.Mobile||r.mobile||''), ods:parseFloat(r.ODS||r.ods||0), area:String(r.Area||r.area||''), device:String(r.Device||r.device||''), cls:String(r.Class||r.cls||''), due:String(r.Due||r.due||''), status:String(r.Status||r.status||'connected').toLowerCase() }))
      setRows(mapped); showToast(`Loaded ${mapped.length} rows from ${file.name}`)
    } catch(err) { showToast('Failed: ' + err.message, 'err') }
    e.target.value = ''
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:22 }}>{icon}</span>
          <span style={{ fontSize:20, fontWeight:700, color:'#111827' }}>{title}</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <ToolBtn icon="📤" label="Upload" onClick={() => fileRef.current?.click()} />
          <ToolBtn icon="⬇" label="Export CSV" onClick={() => exportCSV(filtered)} />
          <ToolBtn icon="➕" label="Add Consumer" primary onClick={addNew} />
          {deleted.length > 0 && <ToolBtn icon="↩" label={`Undo (${deleted.length})`} warn onClick={undoAll} />}
        </div>
        <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{display:'none'}} onChange={onFile} />
      </div>

      {/* Search + filters */}
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e5e7eb', padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:220, background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:8, padding:'8px 12px' }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search id, name, address…" style={{ border:'none', background:'transparent', outline:'none', fontSize:14, width:'100%' }} />
        </div>
        <div style={{ fontSize:13, color:'#16a34a', fontWeight:600, whiteSpace:'nowrap' }}>
          {filtered.length} consumers ✓
        </div>
        {/* Status filter */}
        <div style={{ display:'flex', gap:4 }}>
          {['all','connected','pending','disconnected'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding:'5px 12px', borderRadius:20, border:`1px solid ${filterStatus===s ? '#1d4ed8' : '#e5e7eb'}`,
              background: filterStatus===s ? '#1d4ed8' : '#fff', color: filterStatus===s ? '#fff' : '#6b7280',
              fontSize:12, fontWeight:600, cursor:'pointer'
            }}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
          ))}
        </div>
        {/* View toggle */}
        <div style={{ display:'flex', gap:4, marginLeft:'auto' }}>
          <ViewBtn active={view==='card'} icon="⊞" onClick={() => setView('card')} />
          <ViewBtn active={view==='list'} icon="≡" onClick={() => setView('list')} />
        </div>
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e5e7eb', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#f9fafb', borderBottom:'1px solid #e5e7eb' }}>
                {['ID / Name','Address','Mobile','OSD','Status','Action'].map(col => (
                  <th key={col} onClick={() => col!=='Action' && toggleSort(col.toLowerCase())} style={{ padding:'11px 16px', textAlign:'left', fontWeight:600, fontSize:12, color:'#6b7280', letterSpacing:'0.5px', cursor:'pointer', whiteSpace:'nowrap' }}>
                    {col}{sort.col===col.toLowerCase() ? (sort.dir==='asc'?' ↑':' ↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>No consumers found</td></tr>
              )}
              {filtered.map(r => (
                <tr key={r._id} style={{ borderBottom:'1px solid #f3f4f6' }} onMouseEnter={e => e.currentTarget.style.background='#f9fafb'} onMouseLeave={e => e.currentTarget.style.background=''}>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ fontWeight:600, color:'#111827' }}>{r.id}</div>
                    <div style={{ fontSize:11, color:'#9ca3af' }}>{r.qmr}</div>
                    <div style={{ fontSize:12, color:'#374151' }}>{r.name}</div>
                  </td>
                  <td style={{ padding:'12px 16px', color:'#6b7280', maxWidth:220 }}>
                    <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:200 }}>{r.address}</div>
                    <div style={{ fontSize:11, color:'#1d4ed8', fontWeight:600 }}>{r.area}</div>
                  </td>
                  <td style={{ padding:'12px 16px', color:'#374151' }}>{r.mobile}</td>
                  <td style={{ padding:'12px 16px', textAlign:'right' }}>
                    <div style={{ color:'#dc2626', fontWeight:600 }}>₹{r.ods.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
                    <div style={{ fontSize:11, color:'#9ca3af' }}>{r.area}</div>
                  </td>
                  <td style={{ padding:'12px 16px' }}><Badge status={r.status} /></td>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => openEdit(r)} style={{ background:'#1d4ed8', color:'#fff', border:'none', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontSize:12, fontWeight:600 }}>Update</button>
                      <button onClick={() => deleteRow(r._id)} style={{ background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:6, padding:'6px 8px', cursor:'pointer', fontSize:14 }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CARD VIEW */}
      {view === 'card' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16 }}>
          {filtered.map(r => (
            <ConsumerCard key={r._id} r={r} onEdit={() => openEdit(r)} onDelete={() => deleteRow(r._id)} />
          ))}
          {filtered.length === 0 && <div style={{ gridColumn:'1/-1', textAlign:'center', padding:60, color:'#9ca3af', fontSize:15 }}>No consumers found</div>}
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      {showModal && editRow && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, width:560, maxWidth:'95vw', maxHeight:'85vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>{isNew() ? '➕ Add Consumer' : '✏ Update Consumer — ' + editRow.name}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[['id','Consumer ID'],['name','Name'],['mobile','Mobile'],['address','Address'],['area','Area'],['ods','Outstanding Dues'],['device','Device ID'],['cls','Class'],['due','Due Range'],['status','Status']].map(([k, label]) => (
                <label key={k} style={{ fontSize:12, fontWeight:600, color:'#6b7280', display:'flex', flexDirection:'column', gap:4 }}>
                  {label}
                  {k === 'status' ? (
                    <select value={editRow[k]||''} onChange={e => setEditRow(p=>({...p,[k]:e.target.value}))} style={{ padding:'8px 10px', border:'1px solid #d1d5db', borderRadius:6, fontSize:13 }}>
                      <option value="connected">connected</option>
                      <option value="disconnected">disconnected</option>
                      <option value="pending">pending</option>
                    </select>
                  ) : (
                    <input value={editRow[k]||''} onChange={e => setEditRow(p=>({...p,[k]:e.target.value}))} style={{ padding:'8px 10px', border:'1px solid #d1d5db', borderRadius:6, fontSize:13, outline:'none' }} />
                  )}
                </label>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20 }}>
              <button onClick={() => setShowModal(false)} style={{ padding:'9px 20px', border:'1px solid #d1d5db', borderRadius:8, background:'#fff', cursor:'pointer', fontSize:14 }}>Cancel</button>
              <button onClick={isNew() ? submitNew : saveEdit} style={{ padding:'9px 20px', border:'none', borderRadius:8, background:'#1d4ed8', color:'#fff', fontWeight:600, cursor:'pointer', fontSize:14 }}>
                {isNew() ? 'Add Consumer' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position:'fixed', bottom:24, right:24, background: toast.type==='err' ? '#fef2f2' : '#f0fdf4', border:`1px solid ${toast.type==='err' ? '#fecaca' : '#bbf7d0'}`, color: toast.type==='err' ? '#dc2626' : '#16a34a', padding:'12px 18px', borderRadius:10, fontSize:13, fontWeight:500, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:300 }}>
          {toast.type==='err' ? '⚠ ' : '✓ '}{toast.msg}
        </div>
      )}
    </div>
  )
}

function ConsumerCard({ r, onEdit, onDelete }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background:'#fff', borderRadius:12, border:`1px solid ${hov?'#bfdbfe':'#e5e7eb'}`, overflow:'hidden', transition:'all 0.15s', boxShadow: hov ? '0 4px 16px rgba(59,130,246,0.09)' : 'none' }}
    >
      {/* Card header */}
      <div style={{ padding:'14px 16px 10px', borderBottom:'1px solid #f3f4f6', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontWeight:700, color:'#111827', fontSize:15 }}>{r.name}</div>
          <div style={{ fontSize:12, color:'#6b7280', marginTop:2 }}>
            <span style={{ fontWeight:600, color:'#374151' }}>{r.id}</span>
            {' · '}
            <span style={{ background:'#f3f4f6', borderRadius:4, padding:'1px 6px', fontSize:11 }}>{r.qmr}</span>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
          <span style={{ background:'#1d4ed8', color:'#fff', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:6 }}>{r.area}</span>
          <Badge status={r.status} />
        </div>
      </div>
      {/* Card body */}
      <div style={{ padding:'12px 16px' }}>
        {[
          ['📍', r.address, '#6b7280'],
          ['📞', r.mobile, '#1d4ed8'],
          ['₹', `₹${Number(r.ods).toLocaleString('en-IN',{minimumFractionDigits:2})} · Outstanding Dues`, '#dc2626'],
          ['📅', r.due + ' · Due Date Range', '#6b7280'],
        ].map(([icon, text, color], i) => (
          <div key={i} style={{ display:'flex', gap:10, marginBottom:8, alignItems:'flex-start' }}>
            <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{icon}</span>
            <span style={{ fontSize:12, color, lineHeight:1.4, wordBreak:'break-word' }}>{text}</span>
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#9ca3af', marginTop:4, marginBottom:12 }}>
          <span>Class: <strong style={{ color:'#374151' }}>{r.cls}</strong></span>
          <span>Device: <strong style={{ color:'#374151' }}>{r.device}</strong></span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onEdit} style={{ flex:1, padding:'9px', background:'#111827', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            ✏ Update Status
          </button>
          <button onClick={onDelete} style={{ padding:'9px 12px', background:'#fee2e2', border:'none', borderRadius:8, cursor:'pointer', fontSize:15 }}>🗑</button>
        </div>
      </div>
    </div>
  )
}

/* ─── RECONNECTION PAGE ────────────────────────────────────── */
function ReconnectionPage() {
  const data = CONSUMERS.filter(c => c.status === 'connected')
  return <ConsumerPage title="Reconnection" icon="↺" data={data} />
}

/* ─── DEEMED VISIT PAGE ─────────────────────────────────────── */
function DeemedVisitPage() {
  const data = CONSUMERS.filter(c => c.status === 'disconnected')
  return <ConsumerPage title="Deemed Visit" icon="👤" data={data} />
}

/* ─── DTR MANAGEMENT ────────────────────────────────────────── */
function DTRPage() {
  const dtrs = [
    { _id:uid(), id:'DTR-001', location:'MAHANANDAPUR', area:'ROXY', capacity:'25 KVA', load:'18.4 KW', consumers:42, status:'normal' },
    { _id:uid(), id:'DTR-002', location:'NONATOR',      area:'MUKTI',  capacity:'63 KVA', load:'58.1 KW', consumers:78, status:'overloaded' },
    { _id:uid(), id:'DTR-003', location:'DEBIGANJ',     area:'ROXY',   capacity:'25 KVA', load:'12.0 KW', consumers:30, status:'normal' },
    { _id:uid(), id:'DTR-004', location:'SITALPUR',     area:'LAIBAH', capacity:'100 KVA', load:'91.3 KW', consumers:120, status:'critical' },
    { _id:uid(), id:'DTR-005', location:'BASANTAPUR',   area:'ROXY',   capacity:'63 KVA', load:'44.7 KW', consumers:65, status:'normal' },
    { _id:uid(), id:'DTR-006', location:'HARISHCHANDRA',area:'SA',     capacity:'25 KVA', load:'22.1 KW', consumers:28, status:'overloaded' },
  ]
  const S = { normal: { bg:'#dcfce7', color:'#16a34a' }, overloaded: { bg:'#fef9c3', color:'#b45309' }, critical: { bg:'#fee2e2', color:'#dc2626' } }
  return (
    <div>
      <div style={{ fontSize:20, fontWeight:700, color:'#111827', marginBottom:20 }}>📡 DTR Management</div>
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e5e7eb', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'#f9fafb', borderBottom:'1px solid #e5e7eb' }}>
              {['DTR ID','Location','Area','Capacity','Current Load','Consumers','Status','Action'].map(c => (
                <th key={c} style={{ padding:'11px 16px', textAlign:'left', fontWeight:600, fontSize:12, color:'#6b7280' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dtrs.map(r => (
              <tr key={r._id} style={{ borderBottom:'1px solid #f3f4f6' }}>
                <td style={{ padding:'12px 16px', fontWeight:600 }}>{r.id}</td>
                <td style={{ padding:'12px 16px' }}>{r.location}</td>
                <td style={{ padding:'12px 16px' }}><span style={{ background:'#eff6ff', color:'#1d4ed8', padding:'2px 8px', borderRadius:20, fontSize:11, fontWeight:600 }}>{r.area}</span></td>
                <td style={{ padding:'12px 16px' }}>{r.capacity}</td>
                <td style={{ padding:'12px 16px', color:'#dc2626', fontWeight:600 }}>{r.load}</td>
                <td style={{ padding:'12px 16px' }}>{r.consumers}</td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ ...S[r.status], padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, border:`1px solid ${S[r.status].color}30` }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <button style={{ background:'#1d4ed8', color:'#fff', border:'none', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontSize:12 }}>Inspect</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── NSC INSPECTION ────────────────────────────────────────── */
function NSCPage() {
  const nscs = [
    { _id:uid(), appNo:'NSC-2025-001', applicant:'RAMJAN ALI', address:'VILL RAJNAGAR,MALDA', mobile:'9800112233', date:'12.05.2025', phase:'Single Phase', load:'2 KW', status:'pending' },
    { _id:uid(), appNo:'NSC-2025-002', applicant:'SITARA BEGUM', address:'VILL SUJAPUR,MALDA', mobile:'8800334455', date:'14.05.2025', phase:'Single Phase', load:'1.5 KW', status:'approved' },
    { _id:uid(), appNo:'NSC-2025-003', applicant:'HABIBUR RAHAMAN', address:'VILL KALIACHAK,MALDA', mobile:'7700556677', date:'16.05.2025', phase:'Three Phase', load:'10 KW', status:'pending' },
    { _id:uid(), appNo:'NSC-2025-004', applicant:'FIROJA KHATUN', address:'VILL CHANCHAL,MALDA', mobile:'9900778899', date:'18.05.2025', phase:'Single Phase', load:'2 KW', status:'inspected' },
    { _id:uid(), appNo:'NSC-2025-005', applicant:'HASMAT MONDAL', address:'VILL GAZOLE,MALDA', mobile:'8100990011', date:'20.05.2025', phase:'Three Phase', load:'15 KW', status:'rejected' },
  ]
  const S = { pending:'pending', approved:'connected', inspected:'connected', rejected:'disconnected' }
  return (
    <div>
      <div style={{ fontSize:20, fontWeight:700, color:'#111827', marginBottom:20 }}>📋 NSC Inspection</div>
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e5e7eb', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'#f9fafb', borderBottom:'1px solid #e5e7eb' }}>
              {['App No','Applicant','Address','Mobile','Date','Phase','Load','Status','Action'].map(c => (
                <th key={c} style={{ padding:'11px 16px', textAlign:'left', fontWeight:600, fontSize:12, color:'#6b7280' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nscs.map(r => (
              <tr key={r._id} style={{ borderBottom:'1px solid #f3f4f6' }}>
                <td style={{ padding:'12px 16px', fontWeight:600, color:'#1d4ed8' }}>{r.appNo}</td>
                <td style={{ padding:'12px 16px', fontWeight:600 }}>{r.applicant}</td>
                <td style={{ padding:'12px 16px', color:'#6b7280', maxWidth:180 }}><div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.address}</div></td>
                <td style={{ padding:'12px 16px' }}>{r.mobile}</td>
                <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>{r.date}</td>
                <td style={{ padding:'12px 16px' }}>{r.phase}</td>
                <td style={{ padding:'12px 16px' }}>{r.load}</td>
                <td style={{ padding:'12px 16px' }}><Badge status={S[r.status]} /></td>
                <td style={{ padding:'12px 16px' }}>
                  <button style={{ background:'#1d4ed8', color:'#fff', border:'none', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontSize:12 }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── ADMIN PANEL ───────────────────────────────────────────── */
function AdminPanel() {
  const [users, setUsers] = useState([
    { _id:uid(), username:'admin', name:'Admin User', role:'admin', email:'admin@kushida.in', active:true },
    { _id:uid(), username:'user1', name:'Rajesh Kumar', role:'user', email:'rajesh@kushida.in', active:true },
    { _id:uid(), username:'user2', name:'Sanjay Das', role:'user', email:'sanjay@kushida.in', active:false },
    { _id:uid(), username:'user3', name:'Priya Singh', role:'user', email:'priya@kushida.in', active:true },
  ])
  return (
    <div>
      <div style={{ fontSize:20, fontWeight:700, color:'#111827', marginBottom:20 }}>⚙ Admin Panel</div>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[['Total Consumers','2272','👥','#1d4ed8'],['Disconnected','1701','⚡','#dc2626'],['Deemed Visit','476','👤','#f97316'],['Active Users','3','✅','#16a34a']].map(([label,val,icon,color]) => (
          <div key={label} style={{ background:'#fff', borderRadius:12, border:'1px solid #e5e7eb', padding:'16px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:24 }}>{icon}</span>
              <div>
                <div style={{ fontSize:22, fontWeight:700, color }}>{val}</div>
                <div style={{ fontSize:12, color:'#6b7280' }}>{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* User table */}
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e5e7eb', overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:700, fontSize:15 }}>User Management</span>
          <button style={{ background:'#1d4ed8', color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontSize:13, fontWeight:600 }}>➕ Add User</button>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'#f9fafb', borderBottom:'1px solid #e5e7eb' }}>
              {['Username','Name','Role','Email','Status','Action'].map(c => (
                <th key={c} style={{ padding:'11px 20px', textAlign:'left', fontWeight:600, fontSize:12, color:'#6b7280' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom:'1px solid #f3f4f6' }}>
                <td style={{ padding:'12px 20px', fontWeight:600 }}>{u.username}</td>
                <td style={{ padding:'12px 20px' }}>{u.name}</td>
                <td style={{ padding:'12px 20px' }}>
                  <span style={{ background: u.role==='admin' ? '#eff6ff' : '#f3f4f6', color: u.role==='admin' ? '#1d4ed8' : '#374151', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600 }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding:'12px 20px', color:'#6b7280' }}>{u.email}</td>
                <td style={{ padding:'12px 20px' }}>
                  <span style={{ background: u.active ? '#dcfce7' : '#f3f4f6', color: u.active ? '#16a34a' : '#9ca3af', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600 }}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding:'12px 20px', display:'flex', gap:6 }}>
                  <button style={{ background:'#1d4ed8', color:'#fff', border:'none', borderRadius:6, padding:'5px 12px', cursor:'pointer', fontSize:12 }}>Edit</button>
                  <button onClick={() => setUsers(p => p.filter(x => x._id !== u._id))} style={{ background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:6, padding:'5px 8px', cursor:'pointer', fontSize:13 }}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── SMALL REUSABLE BUTTONS ───────────────────────────────── */
function ToolBtn({ icon, label, onClick, primary, warn }) {
  return (
    <button onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:6, padding:'8px 14px',
      background: primary ? '#1d4ed8' : warn ? '#fef9c3' : '#fff',
      color: primary ? '#fff' : warn ? '#b45309' : '#374151',
      border: `1px solid ${primary ? '#1d4ed8' : warn ? '#fef08a' : '#e5e7eb'}`,
      borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600
    }}>
      {icon} {label}
    </button>
  )
}

function ViewBtn({ active, icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:'6px 10px', border:`1px solid ${active ? '#1d4ed8' : '#e5e7eb'}`,
      background: active ? '#1d4ed8' : '#fff', color: active ? '#fff' : '#6b7280',
      borderRadius:6, cursor:'pointer', fontSize:16
    }}>{icon}</button>
  )
}

/* ─── ROOT APP ──────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState('login')
  const [user, setUser] = useState(null)

  const handleLogin = (u) => { setUser(u); setPage('home') }
  const handleLogout = () => { setUser(null); setPage('login') }

  if (!user) return <LoginPage onLogin={handleLogin} />

  return (
    <Layout user={user} page={page} setPage={setPage} onLogout={handleLogout}>
      {page === 'home'           && <DashboardHome setPage={setPage} />}
      {page === 'disconnection'  && <ConsumerPage title="Disconnection" icon="⚡" data={CONSUMERS.filter(c => c.status==='disconnected' || c.status==='pending')} />}
      {page === 'reconnection'   && <ReconnectionPage />}
      {page === 'deemed'         && <DeemedVisitPage />}
      {page === 'dtr'            && <DTRPage />}
      {page === 'nsc'            && <NSCPage />}
      {page === 'admin'          && <AdminPanel />}
    </Layout>
  )
}
