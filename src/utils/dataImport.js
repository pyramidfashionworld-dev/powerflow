/**
 * Data Import Utility
 * 
 * This utility helps process and validate consumer data before uploading to Google Sheets.
 * It can be run as a Node.js script to analyze and transform your Excel data.
 * 
 * Usage:
 * node src/utils/dataImport.js
 */

import fs from 'fs'
import path from 'path'

/**
 * Parse Excel-like data (from CSV or other sources)
 * Maps to PowerFlow consumer format
 */
export function transformConsumerData(rawData) {
  const headers = rawData[0]
  const consumers = []
  const errors = []

  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i]
    const rowNum = i + 1

    try {
      if (!row || row.length < 10) {
        errors.push(`Row ${rowNum}: Incomplete data (${row?.length || 0} columns)`)
        continue
      }

      const consumerId = String(row[1] || '').trim()
      if (!consumerId) {
        errors.push(`Row ${rowNum}: Missing Consumer ID`)
        continue
      }

      const consumer = {
        id: consumerId,
        consumerId: consumerId,
        name: String(row[2] || '').trim().toUpperCase(),
        address: String(row[3] || '').trim(),
        billingCategory: String(row[4] || '').trim(),
        meterCode: String(row[5] || '').trim(),
        dueDateRange: String(row[6] || '').trim(),
        outstandingDues: parseFloat(row[7] || 0),
        mobile: String(row[8] || '').trim(),
        agency: String(row[9] || '').trim(),
        phaseClass: inferPhaseClass(String(row[4] || '')),
        deviceId: generateDeviceId(consumerId),
        status: inferStatus(parseFloat(row[7] || 0)),
        dueDateStart: parseDate(String(row[6] || ''), 'start'),
        dueDateEnd: parseDate(String(row[6] || ''), 'end'),
      }

      consumers.push(consumer)
    } catch (error) {
      errors.push(`Row ${rowNum}: ${error.message}`)
    }
  }

  return { consumers, errors }
}

function inferPhaseClass(billingCategory) {
  const bc = String(billingCategory).toUpperCase()
  if (bc.includes('3')) return '3-Phase'
  if (bc.includes('2')) return '2-Phase'
  return '1-Phase'
}

function generateDeviceId(consumerId) {
  const id = String(consumerId).replace(/\D/g, '').slice(-4).padStart(4, '0')
  return `DEV-${id}`
}

function inferStatus(dues) {
  const amount = parseFloat(dues) || 0
  if (amount > 5000) return 'disconnected'
  if (amount > 0) return 'pending'
  return 'connected'
}

function parseDate(dateRange, position) {
  const range = String(dateRange || '').trim()
  const parts = range.split('-').map(p => p.trim()).filter(Boolean)

  let dateStr = ''
  if (position === 'start' && parts.length > 0) {
    dateStr = parts[0]
  } else if (position === 'end' && parts.length > 1) {
    dateStr = parts[parts.length - 1]
  }

  if (!dateStr) {
    return position === 'start' ? '2025-05-01' : '2025-05-31'
  }

  // Try to convert DD-MM-YYYY to YYYY-MM-DD
  if (dateStr.length === 10 && dateStr[2] === '-' && dateStr[5] === '-') {
    const [d, m, y] = dateStr.split('-')
    return `${y}-${m}-${d}`
  }

  // Already in YYYY-MM-DD format
  if (dateStr.length === 10 && dateStr[4] === '-') {
    return dateStr
  }

  return position === 'start' ? '2025-05-01' : '2025-05-31'
}

/**
 * Generate statistics about the data
 */
export function analyzeConsumers(consumers) {
  const stats = {
    totalConsumers: consumers.length,
    byStatus: { connected: 0, pending: 0, disconnected: 0 },
    byPhase: { '1-Phase': 0, '2-Phase': 0, '3-Phase': 0 },
    byAgency: {},
    totalOutstanding: 0,
    averageOutstanding: 0,
    maxOutstanding: 0,
    minOutstanding: Infinity,
    agenciesCount: 0,
  }

  consumers.forEach(c => {
    // Status
    stats.byStatus[c.status] = (stats.byStatus[c.status] || 0) + 1

    // Phase
    stats.byPhase[c.phaseClass] = (stats.byPhase[c.phaseClass] || 0) + 1

    // Agency
    stats.byAgency[c.agency] = (stats.byAgency[c.agency] || 0) + 1

    // Outstanding dues
    const dues = parseFloat(c.outstandingDues) || 0
    stats.totalOutstanding += dues
    stats.maxOutstanding = Math.max(stats.maxOutstanding, dues)
    stats.minOutstanding = Math.min(stats.minOutstanding, dues)
  })

  stats.averageOutstanding = (stats.totalOutstanding / consumers.length).toFixed(2)
  stats.agenciesCount = Object.keys(stats.byAgency).length
  if (stats.minOutstanding === Infinity) stats.minOutstanding = 0

  return stats
}

/**
 * Generate a sample Google Sheets format from consumers
 */
export function generateGoogleSheetsFormat(consumers) {
  const headers = [
    'SL NO',
    'Consumer Id',
    'Name',
    'Address',
    'B/C',
    'Meter',
    'O/S Due date Range',
    'D2 Net O/S',
    'Mobile Number',
    'agency'
  ]

  const rows = [headers]
  consumers.forEach((c, i) => {
    rows.push([
      i + 1,
      c.consumerId,
      c.name,
      c.address,
      c.billingCategory,
      c.meterCode,
      c.dueDateRange,
      c.outstandingDues,
      c.mobile,
      c.agency
    ])
  })

  return rows
}

/**
 * Validate consumer data for required fields
 */
export function validateConsumers(consumers) {
  const validationErrors = []
  const requiredFields = ['id', 'consumerId', 'name', 'agency']

  consumers.forEach((c, index) => {
    requiredFields.forEach(field => {
      if (!c[field]) {
        validationErrors.push(
          `Row ${index + 2}: Missing required field "${field}" for consumer ${c.consumerId || 'Unknown'}`
        )
      }
    })

    // Validate data types
    if (typeof c.outstandingDues !== 'number') {
      validationErrors.push(
        `Row ${index + 2}: Outstanding dues should be a number (got ${typeof c.outstandingDues})`
      )
    }

    // Validate phone format
    if (c.mobile && c.mobile.length < 10) {
      validationErrors.push(
        `Row ${index + 2}: Mobile number seems incomplete: ${c.mobile}`
      )
    }
  })

  return validationErrors
}

/**
 * Generate JSON export for manual testing
 */
export function generateJSON(consumers) {
  return JSON.stringify(consumers, null, 2)
}

/**
 * Generate CSV format
 */
export function generateCSV(consumers) {
  const headers = [
    'id',
    'consumerId',
    'name',
    'address',
    'meterCode',
    'agency',
    'phaseClass',
    'deviceId',
    'status',
    'outstandingDues',
    'mobile'
  ]

  const rows = [headers.join(',')]
  consumers.forEach(c => {
    const row = [
      c.id,
      c.consumerId,
      `"${c.name}"`,
      `"${c.address}"`,
      c.meterCode,
      c.agency,
      c.phaseClass,
      c.deviceId,
      c.status,
      c.outstandingDues,
      c.mobile
    ]
    rows.push(row.join(','))
  })

  return rows.join('\n')
}

// Export all utilities
export default {
  transformConsumerData,
  analyzeConsumers,
  generateGoogleSheetsFormat,
  validateConsumers,
  generateJSON,
  generateCSV,
}
