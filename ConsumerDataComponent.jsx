import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

// ============================================
// DATA FORMATTING UTILITIES
// ============================================

/**
 * Convert scientific notation to proper integer
 * Example: 1.32010983E8 → 132010983
 */
const formatConsumerId = (id) => {
  if (!id || id === '') return 'N/A';
  // Handle scientific notation
  const num = Number(id);
  return Math.round(num).toString();
};

/**
 * Format phone number from scientific notation
 * Example: 8.240900271E9 → 8240900271
 */
const formatMobileNumber = (mobile) => {
  if (!mobile || mobile === '') return 'N/A';
  const num = Number(mobile);
  const formatted = Math.round(num).toString();
  // Add spacing for Indian phone numbers: 10 digit format
  if (formatted.length === 10) {
    return `${formatted.substring(0, 5)} ${formatted.substring(5)}`;
  }
  return formatted;
};

/**
 * Format currency values
 */
const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  return '₹' + parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Parse date range string
 * Example: "04.07.2025-24.03.2026" → readable format
 */
const formatDateRange = (dateRange) => {
  if (!dateRange) return 'N/A';
  const parts = dateRange.split('-');
  if (parts.length === 2) {
    return `${parts[0]} to ${parts[1]}`;
  }
  return dateRange;
};

// ============================================
// CONSUMER DETAIL CARD COMPONENT
// ============================================

export function ConsumerDetailsCard({ consumer, onClose }) {
  if (!consumer) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '16px'
        }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: '#1a202c'
            }}>
              {consumer.Name}
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#718096',
              margin: 0
            }}>
              Consumer ID: {formatConsumerId(consumer['Consumer Id'])}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#718096',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Status Badge */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            display: 'inline-block',
            background: '#d1fae5',
            color: '#065f46',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            ✓ Active
          </span>
        </div>

        {/* Consumer Information Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Column 1 */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontSize: '12px',
                color: '#718096',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                Consumer ID
              </p>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                color: '#1a202c'
              }}>
                {formatConsumerId(consumer['Consumer Id'])}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontSize: '12px',
                color: '#718096',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                Class
              </p>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                color: '#1a202c'
              }}>
                {consumer.Class || 'N/A'}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontSize: '12px',
                color: '#718096',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                Mobile Number
              </p>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                color: '#1a202c'
              }}>
                {formatMobileNumber(consumer['Mobile Number'])}
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontSize: '12px',
                color: '#718096',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                Device
              </p>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                color: '#1a202c'
              }}>
                {consumer.Device || 'N/A'}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontSize: '12px',
                color: '#718096',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                Agency
              </p>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                color: '#1a202c'
              }}>
                {consumer.agency || 'N/A'}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontSize: '12px',
                color: '#718096',
                margin: '0 0 6px 0',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                Outstanding Dues
              </p>
              <p style={{
                fontSize: '16px',
                fontWeight: '700',
                margin: 0,
                color: '#ef5350'
              }}>
                {formatCurrency(consumer['Outstanding Dues'])}
              </p>
            </div>
          </div>
        </div>

        {/* Full Width Fields */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '12px',
            color: '#718096',
            margin: '0 0 6px 0',
            textTransform: 'uppercase',
            fontWeight: '600'
          }}>
            Address
          </p>
          <p style={{
            fontSize: '14px',
            margin: 0,
            color: '#1a202c',
            lineHeight: '1.6'
          }}>
            {consumer.Address || 'N/A'}
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '12px',
            color: '#718096',
            margin: '0 0 6px 0',
            textTransform: 'uppercase',
            fontWeight: '600'
          }}>
            Due Date Range
          </p>
          <p style={{
            fontSize: '14px',
            margin: 0,
            color: '#1a202c'
          }}>
            {formatDateRange(consumer['· Due Date Range'])}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginTop: '24px',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '24px'
        }}>
          <button style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Edit Details
          </button>
          <button style={{
            background: '#f3f4f6',
            color: '#1a202c',
            border: '1px solid #e5e7eb',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CONSUMER LIST TABLE COMPONENT
// ============================================

export function ConsumerListTable({ consumers, onSelectConsumer }) {
  const [sortColumn, setSortColumn] = useState('Name');
  const [sortAsc, setSortAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort consumers
  const filteredConsumers = consumers.filter(c =>
    c.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatConsumerId(c['Consumer Id']).includes(searchTerm)
  );

  const sortedConsumers = [...filteredConsumers].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortAsc) {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Search Bar */}
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '12px 16px'
      }}>
        <input
          type="text"
          placeholder="Search by name or consumer ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />
        <span style={{ color: '#9ca3af', marginLeft: '8px' }}>🔍</span>
      </div>

      {/* Table */}
      <div style={{
        overflowX: 'auto',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px'
        }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th
                onClick={() => { setSortColumn('Consumer Id'); setSortAsc(!sortAsc); }}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#1a202c',
                  cursor: 'pointer',
                  borderRight: '1px solid #e5e7eb'
                }}
              >
                Consumer ID {sortColumn === 'Consumer Id' && (sortAsc ? '↑' : '↓')}
              </th>
              <th
                onClick={() => { setSortColumn('Name'); setSortAsc(!sortAsc); }}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#1a202c',
                  cursor: 'pointer',
                  borderRight: '1px solid #e5e7eb'
                }}
              >
                Name {sortColumn === 'Name' && (sortAsc ? '↑' : '↓')}
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#1a202c',
                borderRight: '1px solid #e5e7eb'
              }}>
                Agency
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'right',
                fontWeight: '600',
                color: '#1a202c',
                borderRight: '1px solid #e5e7eb'
              }}>
                Outstanding Dues
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#1a202c'
              }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedConsumers.slice(0, 50).map((consumer, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  background: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#eef2ff'}
                onMouseOut={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#f9fafb'}
              >
                <td style={{ padding: '12px 16px', borderRight: '1px solid #e5e7eb', fontWeight: '600' }}>
                  {formatConsumerId(consumer['Consumer Id'])}
                </td>
                <td style={{ padding: '12px 16px', borderRight: '1px solid #e5e7eb' }}>
                  {consumer.Name}
                </td>
                <td style={{ padding: '12px 16px', borderRight: '1px solid #e5e7eb' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#f0f9ff',
                    color: '#0369a1',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {consumer.agency}
                  </span>
                </td>
                <td style={{
                  padding: '12px 16px',
                  borderRight: '1px solid #e5e7eb',
                  textAlign: 'right',
                  color: '#ef5350',
                  fontWeight: '600'
                }}>
                  {formatCurrency(consumer['Outstanding Dues'])}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => onSelectConsumer(consumer)}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: '16px',
        fontSize: '13px',
        color: '#718096',
        textAlign: 'center'
      }}>
        Showing {sortedConsumers.slice(0, 50).length} of {sortedConsumers.length} records
      </div>
    </div>
  );
}

// ============================================
// MAIN DISCONNECTION MANAGEMENT COMPONENT
// ============================================

export default function DisconnectionManagement({ excelFile }) {
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsumer, setSelectedConsumer] = useState(null);

  // Load Excel file
  useEffect(() => {
    if (excelFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const workbook = XLSX.read(event.target.result, { raw: false });
          let allConsumers = [];

          // Read all sheets
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(worksheet);
            allConsumers = [...allConsumers, ...sheetData];
          });

          setConsumers(allConsumers);
          setLoading(false);
        } catch (error) {
          console.error('Error reading Excel file:', error);
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(excelFile);
    }
  }, [excelFile]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        color: '#718096'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', marginBottom: '12px' }}>Loading consumer data...</p>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          color: '#1a202c'
        }}>
          ⚡ Disconnection Management
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#718096',
          margin: 0
        }}>
          Manage disconnected consumers and reconnection requests. Total records: {consumers.length}
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          borderLeft: '4px solid #ef5350'
        }}>
          <p style={{ fontSize: '12px', color: '#718096', margin: '0 0 8px 0', fontWeight: '600' }}>
            Total Disconnected
          </p>
          <p style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#ef5350' }}>
            {consumers.length}
          </p>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ fontSize: '12px', color: '#718096', margin: '0 0 8px 0', fontWeight: '600' }}>
            Total Outstanding Dues
          </p>
          <p style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#f59e0b' }}>
            {formatCurrency(consumers.reduce((sum, c) => sum + (parseFloat(c['Outstanding Dues']) || 0), 0))}
          </p>
        </div>
      </div>

      {/* Consumer List */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '24px'
      }}>
        <ConsumerListTable
          consumers={consumers}
          onSelectConsumer={setSelectedConsumer}
        />
      </div>

      {/* Consumer Details Modal */}
      {selectedConsumer && (
        <ConsumerDetailsCard
          consumer={selectedConsumer}
          onClose={() => setSelectedConsumer(null)}
        />
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
