// ─── AUTH USERS ──────────────────────────────────────────────────────────────
export const USERS = [
  { id: 1, email: 'admin@utility.com',  password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: 2, email: 'rajesh@utility.com', password: 'user123',  role: 'user',  name: 'Rajesh Kumar' },
  { id: 3, email: 'priya@utility.com',  password: 'user123',  role: 'user',  name: 'Priya Sharma' },
]

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
export const AGENCIES   = ['ROXY', 'MUKTI', 'LAIBA', 'SIGMA', 'PAL_CONS']
export const STATUSES   = ['connected', 'disconnected', 'pending']
export const PHASES     = ['1-Phase', '2-Phase', '3-Phase']

// ─── AGENCY LAST-UPDATE DATA ──────────────────────────────────────────────────
export const AGENCY_UPDATES = [
  { name: 'ROXY',     lastUpdate: '2025-05-22T10:30:00', pendingTasks: 5,  color: '#6366f1' },
  { name: 'MUKTI',    lastUpdate: '2025-05-22T09:15:00', pendingTasks: 3,  color: '#0ea5e9' },
  { name: 'LAIBA',    lastUpdate: '2025-05-21T16:45:00', pendingTasks: 8,  color: '#10b981' },
  { name: 'SIGMA',    lastUpdate: '2025-05-22T11:00:00', pendingTasks: 2,  color: '#f59e0b' },
  { name: 'PAL_CONS', lastUpdate: '2025-05-20T14:20:00', pendingTasks: 12, color: '#ef4444' },
]

// ─── CONSUMER RECORDS ─────────────────────────────────────────────────────────
// Initial seed — stored in localStorage so status changes persist.
export const INITIAL_CONSUMERS = [
  { id:'PF-001', consumerId:'PF-001', name:'Ramesh Chandra Gupta',    meterCode:'MTR-4821', agency:'ROXY',     address:'12, Rabindra Sarani, Kolkata',      mobile:'9831042567', outstandingDues:3420,  dueDateStart:'2025-04-01', dueDateEnd:'2025-04-30', phaseClass:'1-Phase', deviceId:'DEV-1021', status:'disconnected' },
  { id:'PF-002', consumerId:'PF-002', name:'Sunita Devi Roy',         meterCode:'MTR-2934', agency:'MUKTI',    address:'45, Lake Town, Kolkata',            mobile:'9007812345', outstandingDues:1890,  dueDateStart:'2025-03-15', dueDateEnd:'2025-04-15', phaseClass:'1-Phase', deviceId:'DEV-1022', status:'pending' },
  { id:'PF-003', consumerId:'PF-003', name:'Mohan Lal Sharma',        meterCode:'MTR-7723', agency:'LAIBA',    address:'7, Salt Lake Sector V, Kolkata',    mobile:'9830011223', outstandingDues:5600,  dueDateStart:'2025-02-01', dueDateEnd:'2025-03-01', phaseClass:'3-Phase', deviceId:'DEV-1023', status:'disconnected' },
  { id:'PF-004', consumerId:'PF-004', name:'Anika Banerjee',          meterCode:'MTR-5512', agency:'SIGMA',    address:'33, Behala, Kolkata',               mobile:'9123456780', outstandingDues:780,   dueDateStart:'2025-05-01', dueDateEnd:'2025-05-31', phaseClass:'1-Phase', deviceId:'DEV-1024', status:'connected' },
  { id:'PF-005', consumerId:'PF-005', name:'Debasis Mondal',          meterCode:'MTR-8834', agency:'PAL_CONS', address:'21, Dum Dum, Kolkata',              mobile:'9876543210', outstandingDues:2250,  dueDateStart:'2025-04-10', dueDateEnd:'2025-05-10', phaseClass:'2-Phase', deviceId:'DEV-1025', status:'pending' },
  { id:'PF-006', consumerId:'PF-006', name:'Kavitha Nair',            meterCode:'MTR-3341', agency:'ROXY',     address:'56, Gariahat, Kolkata',             mobile:'8012345678', outstandingDues:0,     dueDateStart:'2025-05-15', dueDateEnd:'2025-06-15', phaseClass:'1-Phase', deviceId:'DEV-1026', status:'connected' },
  { id:'PF-007', consumerId:'PF-007', name:'Suresh Kumar Patel',      meterCode:'MTR-6698', agency:'MUKTI',    address:'18, Howrah Station Road, Howrah',   mobile:'9432101987', outstandingDues:6780,  dueDateStart:'2025-01-15', dueDateEnd:'2025-02-15', phaseClass:'3-Phase', deviceId:'DEV-1027', status:'disconnected' },
  { id:'PF-008', consumerId:'PF-008', name:'Priyanka Das',            meterCode:'MTR-1122', agency:'LAIBA',    address:'9, Park Street, Kolkata',           mobile:'9910234567', outstandingDues:1340,  dueDateStart:'2025-04-20', dueDateEnd:'2025-05-20', phaseClass:'1-Phase', deviceId:'DEV-1028', status:'pending' },
  { id:'PF-009', consumerId:'PF-009', name:'Tapas Chakraborty',       meterCode:'MTR-4453', agency:'SIGMA',    address:'74, Jadavpur, Kolkata',             mobile:'9800011122', outstandingDues:4500,  dueDateStart:'2025-03-01', dueDateEnd:'2025-04-01', phaseClass:'2-Phase', deviceId:'DEV-1029', status:'disconnected' },
  { id:'PF-010', consumerId:'PF-010', name:'Nalini Chatterjee',       meterCode:'MTR-9987', agency:'PAL_CONS', address:'3, Tollygunge, Kolkata',            mobile:'9051234567', outstandingDues:320,   dueDateStart:'2025-05-01', dueDateEnd:'2025-05-31', phaseClass:'1-Phase', deviceId:'DEV-1030', status:'connected' },
  { id:'PF-011', consumerId:'PF-011', name:'Bikram Singh',            meterCode:'MTR-7712', agency:'ROXY',     address:'67, Barasat, North 24 Parganas',    mobile:'9734567890', outstandingDues:8900,  dueDateStart:'2025-01-01', dueDateEnd:'2025-02-01', phaseClass:'3-Phase', deviceId:'DEV-1031', status:'disconnected' },
  { id:'PF-012', consumerId:'PF-012', name:'Mamata Halder',           meterCode:'MTR-2299', agency:'MUKTI',    address:'29, Baghbazar, Kolkata',            mobile:'9836547210', outstandingDues:2100,  dueDateStart:'2025-04-05', dueDateEnd:'2025-05-05', phaseClass:'1-Phase', deviceId:'DEV-1032', status:'pending' },
  { id:'PF-013', consumerId:'PF-013', name:'Somnath Bose',            meterCode:'MTR-5544', agency:'LAIBA',    address:'112, Shyambazar, Kolkata',          mobile:'9051122334', outstandingDues:0,     dueDateStart:'2025-05-10', dueDateEnd:'2025-06-10', phaseClass:'2-Phase', deviceId:'DEV-1033', status:'connected' },
  { id:'PF-014', consumerId:'PF-014', name:'Lakshmi Iyer',            meterCode:'MTR-3388', agency:'SIGMA',    address:'5, Alipore, Kolkata',               mobile:'9867453210', outstandingDues:3750,  dueDateStart:'2025-03-20', dueDateEnd:'2025-04-20', phaseClass:'1-Phase', deviceId:'DEV-1034', status:'disconnected' },
  { id:'PF-015', consumerId:'PF-015', name:'Arnab Ghosh',             meterCode:'MTR-1177', agency:'PAL_CONS', address:'88, Kasba, Kolkata',                mobile:'9134567890', outstandingDues:980,   dueDateStart:'2025-04-25', dueDateEnd:'2025-05-25', phaseClass:'1-Phase', deviceId:'DEV-1035', status:'connected' },
  { id:'PF-016', consumerId:'PF-016', name:'Reena Sarkar',            meterCode:'MTR-8821', agency:'ROXY',     address:'44, Entally, Kolkata',              mobile:'9831122334', outstandingDues:5200,  dueDateStart:'2025-02-10', dueDateEnd:'2025-03-10', phaseClass:'3-Phase', deviceId:'DEV-1036', status:'disconnected' },
  { id:'PF-017', consumerId:'PF-017', name:'Gopal Mukherjee',         meterCode:'MTR-6634', agency:'MUKTI',    address:'15, Sodepur, North 24 Parganas',    mobile:'9051234987', outstandingDues:1650,  dueDateStart:'2025-04-15', dueDateEnd:'2025-05-15', phaseClass:'2-Phase', deviceId:'DEV-1037', status:'pending' },
  { id:'PF-018', consumerId:'PF-018', name:'Suman Mitra',             meterCode:'MTR-2278', agency:'LAIBA',    address:'6, Uttarpara, Hooghly',             mobile:'9830099887', outstandingDues:0,     dueDateStart:'2025-05-20', dueDateEnd:'2025-06-20', phaseClass:'1-Phase', deviceId:'DEV-1038', status:'connected' },
  { id:'PF-019', consumerId:'PF-019', name:'Rima Paul',               meterCode:'MTR-4499', agency:'SIGMA',    address:'37, Shibpur, Howrah',               mobile:'9007654321', outstandingDues:7100,  dueDateStart:'2025-01-20', dueDateEnd:'2025-02-20', phaseClass:'3-Phase', deviceId:'DEV-1039', status:'disconnected' },
  { id:'PF-020', consumerId:'PF-020', name:'Anindya Sen',             meterCode:'MTR-7765', agency:'PAL_CONS', address:'52, Baguiati, Kolkata',             mobile:'9678901234', outstandingDues:430,   dueDateStart:'2025-05-01', dueDateEnd:'2025-05-31', phaseClass:'1-Phase', deviceId:'DEV-1040', status:'connected' },
  { id:'PF-021', consumerId:'PF-021', name:'Santanu Biswas',          meterCode:'MTR-3312', agency:'ROXY',     address:'23, Naihati, North 24 Parganas',    mobile:'9432567890', outstandingDues:2890,  dueDateStart:'2025-03-25', dueDateEnd:'2025-04-25', phaseClass:'2-Phase', deviceId:'DEV-1041', status:'pending' },
  { id:'PF-022', consumerId:'PF-022', name:'Chandra Kanta Dutta',     meterCode:'MTR-8856', agency:'MUKTI',    address:'78, Kankurgachi, Kolkata',          mobile:'9854321678', outstandingDues:0,     dueDateStart:'2025-05-08', dueDateEnd:'2025-06-08', phaseClass:'1-Phase', deviceId:'DEV-1042', status:'connected' },
  { id:'PF-023', consumerId:'PF-023', name:'Ananya Majumdar',         meterCode:'MTR-5578', agency:'LAIBA',    address:'10, Bally, Howrah',                 mobile:'9123009876', outstandingDues:4680,  dueDateStart:'2025-02-20', dueDateEnd:'2025-03-20', phaseClass:'3-Phase', deviceId:'DEV-1043', status:'disconnected' },
  { id:'PF-024', consumerId:'PF-024', name:'Prabhat Saha',            meterCode:'MTR-1198', agency:'SIGMA',    address:'41, Rishra, Hooghly',               mobile:'9067890123', outstandingDues:1200,  dueDateStart:'2025-04-18', dueDateEnd:'2025-05-18', phaseClass:'1-Phase', deviceId:'DEV-1044', status:'pending' },
  { id:'PF-025', consumerId:'PF-025', name:'Mousumi Adhikari',        meterCode:'MTR-9923', agency:'PAL_CONS', address:'63, Ariadaha, North 24 Parganas',   mobile:'9800112233', outstandingDues:3300,  dueDateStart:'2025-03-10', dueDateEnd:'2025-04-10', phaseClass:'2-Phase', deviceId:'DEV-1045', status:'disconnected' },
]

// ─── STORAGE KEY ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'pf_consumers'

// Returns consumers from localStorage (initialises on first run)
export function getConsumers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONSUMERS))
    return INITIAL_CONSUMERS
  } catch {
    return INITIAL_CONSUMERS
  }
}

// Persists the full consumer array
export function saveConsumers(consumers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consumers))
}

// Update one consumer's status
export function updateConsumerStatus(id, newStatus) {
  const consumers = getConsumers()
  const updated = consumers.map(c => c.id === id ? { ...c, status: newStatus } : c)
  saveConsumers(updated)
  return updated
}
