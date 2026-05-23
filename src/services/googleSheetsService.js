// src/services/googleSheetsService.js
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID
const API_KEY  = import.meta.env.VITE_GOOGLE_API_KEY

export async function fetchSheetData(sheetName = 'Sheet1') {
  if (!SHEET_ID || !API_KEY) {
    throw new Error('Missing VITE_GOOGLE_SHEET_ID or VITE_GOOGLE_API_KEY in .env')
  }
  const range = encodeURIComponent(`${sheetName}!A1:Z1000`)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Google Sheets API error: ${res.status}`)
  const json = await res.json()
  const [headers, ...rows] = json.values || []
  if (!headers) return []
  return rows.map((row, i) => {
    const obj = { _id: `gs_${i}` }
    headers.forEach((h, j) => { obj[h] = row[j] ?? '' })
    return obj
  })
}
