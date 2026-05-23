// src/services/fileParserService.js
import * as XLSX from 'xlsx'

export function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        const rows = json.map((row, i) => ({ ...row, _id: `file_${i}` }))
        resolve({ rows, sheetName, sheetNames: workbook.SheetNames })
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

export function exportToCSV(rows, filename = 'export.csv') {
  if (!rows.length) return
  const keys = Object.keys(rows[0]).filter(k => k !== '_id')
  const header = keys.join(',')
  const lines = rows.map(row =>
    keys.map(k => {
      const val = String(row[k] ?? '')
      return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val
    }).join(',')
  )
  const csv = [header, ...lines].join('\n')
  downloadBlob(new Blob([csv], { type: 'text/csv' }), filename)
}

export function exportToExcel(rows, filename = 'export.xlsx') {
  if (!rows.length) return
  const clean = rows.map(r => {
    const obj = {}
    Object.keys(r).filter(k => k !== '_id').forEach(k => { obj[k] = r[k] })
    return obj
  })
  const ws = XLSX.utils.json_to_sheet(clean)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, filename)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
}
