/**
 * Google Sheets Service
 * Fetches consumer data from a Google Sheet in real-time
 * 
 * Setup:
 * 1. Create a Google Sheet with your consumer data
 * 2. Share it publicly (or use service account)
 * 3. Get the SPREADSHEET_ID from the URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
 * 4. Add to your .env file: VITE_GOOGLE_SHEET_ID=your-sheet-id
 */

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const SHEET_NAME = 'Sheet1' // Change if your sheet has a different name

// Google Sheets API v4 endpoint
const SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}`

/**
 * Fetch raw data from Google Sheet
 * @returns {Promise<Array>} Array of rows from the sheet
 */
export async function fetchRawSheetData() {
  if (!SHEET_ID) {
    console.warn('Google Sheet ID not configured. Using mock data.')
    return null
  }

  try {
    const url = `${SHEETS_API_URL}?key=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`)
    }

    const data = await response.json()
    return data.values || []
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error)
    return null
  }
}

/**
 * Parse sheet data into consumer records
 * Maps Google Sheet columns to consumer format
 * 
 * Expected columns (in order):
 * 0: SL NO
 * 1: Consumer Id
 * 2: Name
 * 3: Address
 * 4: B/C (Billing Category)
 * 5: Meter
 * 6: O/S Due date Range
 * 7: D2 Net O/S (Outstanding Dues)
 * 8: Mobile Number
 * 9: Agency
 */
export function parseConsumerData(rawData) {
  if (!rawData || rawData.length < 2) return []

  const headers = rawData[0]
  const consumers = []

  // Skip header row and process data
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i]
    if (!row || row.length < 10) continue // Skip incomplete rows

    try {
      const consumer = {
        id: String(row[1] || '').trim(),
        consumerId: String(row[1] || '').trim(),
        name: String(row[2] || '').trim().toUpperCase(),
        address: String(row[3] || '').trim(),
        billingCategory: String(row[4] || '').trim(),
        meterCode: String(row[5] || '').trim(),
        dueDateRange: String(row[6] || '').trim(),
        outstandingDues: parseFloat(row[7] || 0),
        mobile: String(row[8] || '').trim(),
        agency: String(row[9] || '').trim(),
        
        // Additional fields with defaults
        phaseClass: getPhaseClass(row[4]), // Infer from B/C
        deviceId: generateDeviceId(String(row[1])),
        status: getStatusFromDues(parseFloat(row[7])),
        
        // Parse date range if available
        dueDateStart: extractDateStart(String(row[6])),
        dueDateEnd: extractDateEnd(String(row[6])),
      }

      // Validate required fields
      if (consumer.id && consumer.consumerId && consumer.name) {
        consumers.push(consumer)
      }
    } catch (error) {
      console.warn(`Error parsing row ${i}:`, error)
    }
  }

  return consumers
}

/**
 * Infer phase class from billing category
 */
function getPhaseClass(billingCategory) {
  const bc = String(billingCategory || '').toUpperCase()
  if (bc.includes('3')) return '3-Phase'
  if (bc.includes('2')) return '2-Phase'
  return '1-Phase'
}

/**
 * Generate device ID from consumer ID
 */
function generateDeviceId(consumerId) {
  const id = String(consumerId).replace(/\D/g, '').slice(-4)
  return `DEV-${id}`
}

/**
 * Determine status based on outstanding dues
 * If dues > 5000: disconnected
 * If dues > 0: pending
 * If dues = 0: connected
 */
function getStatusFromDues(dues) {
  const amount = parseFloat(dues) || 0
  if (amount > 5000) return 'disconnected'
  if (amount > 0) return 'pending'
  return 'connected'
}

/**
 * Extract start date from date range string
 * Format: "YYYY-MM-DD - YYYY-MM-DD" or "DD-MM-YYYY - DD-MM-YYYY"
 */
function extractDateStart(dateRange) {
  const range = String(dateRange || '').trim()
  if (!range) return '2025-05-01'
  
  const parts = range.split('-')
  if (parts.length >= 2) {
    let date = parts[0].trim()
    // Handle different date formats
    if (date.length === 10 && date[4] === '-') return date // Already YYYY-MM-DD
    if (date.length === 10 && date[2] === '-') {
      // Convert DD-MM-YYYY to YYYY-MM-DD
      const [d, m, y] = date.split('-')
      return `${y}-${m}-${d}`
    }
  }
  return '2025-05-01'
}

/**
 * Extract end date from date range string
 */
function extractDateEnd(dateRange) {
  const range = String(dateRange || '').trim()
  if (!range) return '2025-05-31'
  
  const parts = range.split('-')
  if (parts.length >= 3) {
    let date = parts[2].trim()
    if (date.length === 10 && date[4] === '-') return date
    if (date.length === 10 && date[2] === '-') {
      const [d, m, y] = date.split('-')
      return `${y}-${m}-${d}`
    }
  }
  return '2025-05-31'
}

/**
 * Fetch and parse consumers in one call
 */
export async function fetchConsumersFromSheet() {
  const rawData = await fetchRawSheetData()
  if (!rawData) return null
  return parseConsumerData(rawData)
}

/**
 * Cache consumers in localStorage with timestamp
 */
const CACHE_KEY = 'pf_consumers_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function getCachedConsumers() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }

    return data
  } catch {
    return null
  }
}

export function setCachedConsumers(consumers) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: consumers,
      timestamp: Date.now(),
    }))
  } catch (error) {
    console.warn('Could not cache consumers:', error)
  }
}

/**
 * Get unique agencies from consumers
 */
export function getAgenciesFromConsumers(consumers) {
  const agencies = new Set()
  consumers.forEach(c => {
    if (c.agency) agencies.add(c.agency)
  })
  return Array.from(agencies).sort()
}
