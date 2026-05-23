/**
 * Google Sheets Service
 * Fetches consumer data from Google Sheets
 *
 * Required .env variables (Vite prefix VITE_ is mandatory):
 *   VITE_GOOGLE_SHEET_ID=your_sheet_id_here
 *   VITE_GOOGLE_API_KEY=your_api_key_here
 *   VITE_SHEET_NAME=Sheet1   ← optional, defaults to Sheet1
 */

const SHEET_ID   = import.meta.env.VITE_GOOGLE_SHEET_ID
const API_KEY    = import.meta.env.VITE_GOOGLE_API_KEY
const SHEET_NAME = import.meta.env.VITE_SHEET_NAME || 'Sheet1'

// ─── Guard: fail fast with clear messages ────────────────────────────────────
if (!SHEET_ID) {
  console.error(
    '[googleSheetsService] ❌ VITE_GOOGLE_SHEET_ID is not set.\n' +
    'Create a .env file at your project root with:\n' +
    '  VITE_GOOGLE_SHEET_ID=your_sheet_id'
  )
}

if (!API_KEY) {
  console.error(
    '[googleSheetsService] ❌ VITE_GOOGLE_API_KEY is not set.\n' +
    'Create a .env file at your project root with:\n' +
    '  VITE_GOOGLE_API_KEY=your_api_key'
  )
}

// ─── API URL ──────────────────────────────────────────────────────────────────
const SHEETS_API_URL =
  `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}` +
  `/values/${encodeURIComponent(SHEET_NAME)}`

// ─── Fetch raw rows from Google Sheets ───────────────────────────────────────
/**
 * @returns {Promise<string[][]|null>} 2-D array of cell values, or null on error
 */
export async function fetchRawSheetData() {
  if (!SHEET_ID || !API_KEY) {
    console.error('[fetchRawSheetData] Missing env variables — aborting fetch.')
    return null
  }

  try {
    const url = `${SHEETS_API_URL}?key=${API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('[fetchRawSheetData] Google Sheets API error:', errorBody)
      throw new Error(`Google Sheets API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.values || data.values.length === 0) {
      console.warn('[fetchRawSheetData] Sheet returned no data.')
      return []
    }

    return data.values
  } catch (error) {
    console.error('[fetchRawSheetData] Fetch failed:', error)
    return null
  }
}

// ─── Parse rows into consumer objects ────────────────────────────────────────
/**
 * Expects row layout (0-indexed columns):
 *   [0]=serial, [1]=consumerId, [2]=name, [3]=address,
 *   [4]=billingCategory, [5]=meterCode, [6]=dueDateRange,
 *   [7]=outstandingDues, [8]=mobile, [9]=agency
 *
 * @param {string[][]} rawData
 * @returns {object[]}
 */
export function parseConsumerData(rawData) {
  if (!rawData || rawData.length < 2) {
    console.warn('[parseConsumerData] No valid data (need header + at least 1 row).')
    return []
  }

  // Row 0 = headers — skip it
  const consumers = []

  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i]

    // Skip rows that are too short
    if (!row || row.length < 10) continue

    try {
      const dues = parseFloat(row[7]) || 0
      const dateRange = String(row[6] || '').trim()

      const consumer = {
        id:               String(row[1] || '').trim(),
        consumerId:       String(row[1] || '').trim(),
        name:             String(row[2] || '').trim().toUpperCase(),
        address:          String(row[3] || '').trim(),
        billingCategory:  String(row[4] || '').trim(),
        meterCode:        String(row[5] || '').trim(),
        dueDateRange:     dateRange,
        outstandingDues:  dues,
        mobile:           String(row[8] || '').trim(),
        agency:           String(row[9] || '').trim(),

        // Derived fields
        phaseClass:   getPhaseClass(row[4]),
        deviceId:     generateDeviceId(String(row[1])),
        status:       getStatusFromDues(dues),
        dueDateStart: extractDatePart(dateRange, 'start'),
        dueDateEnd:   extractDatePart(dateRange, 'end'),
      }

      // Only push if the row has meaningful identity data
      if (consumer.id && consumer.name) {
        consumers.push(consumer)
      }
    } catch (error) {
      console.warn(`[parseConsumerData] Skipping row ${i} due to error:`, error)
    }
  }

  return consumers
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns '3-Phase', '2-Phase', or '1-Phase' based on billing category */
function getPhaseClass(billingCategory) {
  const bc = String(billingCategory || '').toUpperCase()
  if (bc.includes('3')) return '3-Phase'
  if (bc.includes('2')) return '2-Phase'
  return '1-Phase'
}

/** Generates a short device ID from the consumer ID digits */
function generateDeviceId(consumerId) {
  const digits = String(consumerId || '').replace(/\D/g, '').slice(-4)
  return `DEV-${digits}`
}

/** Maps outstanding dues to a connection status */
function getStatusFromDues(dues) {
  const amount = parseFloat(dues) || 0
  if (amount > 5000) return 'disconnected'
  if (amount > 0)    return 'pending'
  return 'connected'
}

/**
 * Parses a date range string like "01-May-2025 to 31-May-2025"
 * and returns either the start or end date in YYYY-MM-DD format.
 * Falls back to sensible defaults if parsing fails.
 *
 * @param {string} dateRange
 * @param {'start'|'end'} part
 * @returns {string} ISO date string
 */
function extractDatePart(dateRange, part) {
  const FALLBACK_START = '2025-05-01'
  const FALLBACK_END   = '2025-05-31'

  if (!dateRange) return part === 'start' ? FALLBACK_START : FALLBACK_END

  // Try splitting on common separators: " to ", " - ", "–"
  const separators = [' to ', ' - ', '–', '~']
  let parts = null

  for (const sep of separators) {
    if (dateRange.includes(sep)) {
      parts = dateRange.split(sep).map((s) => s.trim())
      break
    }
  }

  if (!parts || parts.length < 2) {
    // Single date provided — use it for both start and end
    const parsed = new Date(dateRange)
    if (!isNaN(parsed)) {
      const iso = parsed.toISOString().split('T')[0]
      return iso
    }
    return part === 'start' ? FALLBACK_START : FALLBACK_END
  }

  const raw = part === 'start' ? parts[0] : parts[1]
  const parsed = new Date(raw)

  if (!isNaN(parsed)) {
    return parsed.toISOString().split('T')[0]
  }

  return part === 'start' ? FALLBACK_START : FALLBACK_END
}

// ─── Main export ──────────────────────────────────────────────────────────────

/** Fetches and parses consumers in one call */
export async function fetchConsumersFromSheet() {
  const rawData = await fetchRawSheetData()
  if (!rawData) return []
  return parseConsumerData(rawData)
}

// ─── In-memory cache (safe for SSR / Vercel) ─────────────────────────────────
// localStorage is avoided here because it breaks in SSR/Node environments.
// Use this simple module-level cache instead.

let _cache = null
let _cacheTimestamp = 0
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes

export function getCachedConsumers() {
  if (!_cache) return null
  if (Date.now() - _cacheTimestamp > CACHE_DURATION_MS) {
    _cache = null
    return null
  }
  return _cache
}

export function setCachedConsumers(consumers) {
  _cache = consumers
  _cacheTimestamp = Date.now()
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Returns a sorted list of unique agency names from the consumer list */
export function getAgenciesFromConsumers(consumers) {
  const agencies = new Set()
  consumers.forEach((c) => { if (c.agency) agencies.add(c.agency) })
  return Array.from(agencies).sort()
}