// ============================================
// QUICK REFERENCE GUIDE
// ============================================

// 1. BASIC SETUP
// ============================================

import DisconnectionManagement from './components/ConsumerDataComponent';
import {
  formatConsumerId,
  formatMobileNumber,
  formatCurrency
} from './components/ConsumerDataComponent';

// 2. FORMAT NUMBERS EXAMPLES
// ============================================

// Consumer ID Formatting
const id1 = formatConsumerId(1.32010983E8);
console.log(id1);  // Output: "132010983"

const id2 = formatConsumerId('');
console.log(id2);  // Output: "N/A"

// Mobile Number Formatting
const mobile1 = formatMobileNumber(8.240900271E9);
console.log(mobile1);  // Output: "82409 00271"

const mobile2 = formatMobileNumber('');
console.log(mobile2);  // Output: "N/A"

// Currency Formatting
const amount1 = formatCurrency(13198.68);
console.log(amount1);  // Output: "₹13,198.68"

const amount2 = formatCurrency(1000000);
console.log(amount2);  // Output: "₹10,00,000.00"

// 3. DISPLAYING A CONSUMER
// ============================================

function DisplayConsumer({ consumer }) {
  return (
    <div>
      <h2>{consumer.Name}</h2>
      
      <p><strong>Consumer ID:</strong> {formatConsumerId(consumer['Consumer Id'])}</p>
      
      <p><strong>Mobile:</strong> {formatMobileNumber(consumer['Mobile Number'])}</p>
      
      <p><strong>Address:</strong> {consumer.Address}</p>
      
      <p><strong>Outstanding Dues:</strong> {formatCurrency(consumer['Outstanding Dues'])}</p>
      
      <p><strong>Agency:</strong> {consumer.agency}</p>
    </div>
  );
}

// 4. USING FILE UPLOAD
// ============================================

import { useState } from 'react';
import DisconnectionManagement from './components/ConsumerDataComponent';

function App() {
  const [excelFile, setExcelFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
      />
      
      {excelFile && (
        <DisconnectionManagement excelFile={excelFile} />
      )}
    </>
  );
}

// 5. CONSUMER LIST WITH SEARCH
// ============================================

import { ConsumerListTable } from './components/ConsumerDataComponent';
import { useState } from 'react';

function ConsumersList({ consumers }) {
  const [selectedConsumer, setSelectedConsumer] = useState(null);

  return (
    <>
      <ConsumerListTable
        consumers={consumers}
        onSelectConsumer={setSelectedConsumer}
      />
      
      {selectedConsumer && (
        <div>
          <h3>Selected: {selectedConsumer.Name}</h3>
          <p>ID: {formatConsumerId(selectedConsumer['Consumer Id'])}</p>
        </div>
      )}
    </>
  );
}

// 6. PROCESSING BULK CONSUMERS
// ============================================

function processBulkConsumers(rawConsumers) {
  return rawConsumers.map(consumer => ({
    ...consumer,
    formattedId: formatConsumerId(consumer['Consumer Id']),
    formattedMobile: formatMobileNumber(consumer['Mobile Number']),
    formattedDues: formatCurrency(consumer['Outstanding Dues'])
  }));
}

const processed = processBulkConsumers(rawData);
processed.forEach(c => {
  console.log(`${c.Name}: ${c.formattedDues}`);
});

// 7. FILTERING CONSUMERS
// ============================================

function filterByAgency(consumers, agencyName) {
  return consumers.filter(c => c.agency === agencyName);
}

function filterByDuesRange(consumers, minDues, maxDues) {
  return consumers.filter(c => {
    const dues = parseFloat(c['Outstanding Dues']) || 0;
    return dues >= minDues && dues <= maxDues;
  });
}

// Usage:
const annapurnaConsumers = filterByAgency(consumers, 'Annapurna');
const highDuesConsumers = filterByDuesRange(consumers, 5000, 20000);

// 8. CALCULATING STATISTICS
// ============================================

function calculateStats(consumers) {
  const totalDues = consumers.reduce((sum, c) => {
    return sum + (parseFloat(c['Outstanding Dues']) || 0);
  }, 0);

  const averageDues = totalDues / consumers.length;
  
  const byAgency = {};
  consumers.forEach(c => {
    if (!byAgency[c.agency]) {
      byAgency[c.agency] = {
        count: 0,
        totalDues: 0
      };
    }
    byAgency[c.agency].count++;
    byAgency[c.agency].totalDues += parseFloat(c['Outstanding Dues']) || 0;
  });

  return {
    totalConsumers: consumers.length,
    totalDues: formatCurrency(totalDues),
    averageDues: formatCurrency(averageDues),
    byAgency: byAgency
  };
}

// Usage:
const stats = calculateStats(consumers);
console.log(`Total: ${stats.totalConsumers} consumers`);
console.log(`Total Dues: ${stats.totalDues}`);

// 9. EXPORTING TO CSV
// ============================================

function exportToCSV(consumers) {
  const headers = ['Consumer ID', 'Name', 'Mobile', 'Agency', 'Outstanding Dues'];
  
  const rows = consumers.map(c => [
    formatConsumerId(c['Consumer Id']),
    c.Name,
    formatMobileNumber(c['Mobile Number']),
    c.agency,
    formatCurrency(c['Outstanding Dues'])
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `consumers_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}

// 10. COMMON ERRORS & FIXES
// ============================================

// ERROR 1: Numbers still in scientific notation
// FIX: Use formatConsumerId() function
const raw = 1.32010983E8;
const formatted = formatConsumerId(raw);  // "132010983"

// ERROR 2: Currency shows as 0
// FIX: Parse string to number first
const dues = parseFloat(consumer['Outstanding Dues']) || 0;
const formatted = formatCurrency(dues);

// ERROR 3: Mobile number empty
// FIX: The function returns "N/A" for empty values
const mobile = formatMobileNumber(consumer['Mobile Number']);
console.log(mobile);  // "N/A" or formatted number

// ERROR 4: Array of consumers not defined
// FIX: Must pass array, not single object
consumers.map(c => formatConsumerId(c['Consumer Id']));  // Correct
formatConsumerId(consumer['Consumer Id']);  // Wrong - not array

// 11. DATA VALIDATION EXAMPLES
// ============================================

function validateConsumer(consumer) {
  const errors = [];

  if (!consumer.Name) errors.push('Name is required');
  if (!consumer['Consumer Id']) errors.push('Consumer ID is required');
  
  const id = formatConsumerId(consumer['Consumer Id']);
  if (id === 'N/A') errors.push('Invalid Consumer ID');

  const mobile = formatMobileNumber(consumer['Mobile Number']);
  if (mobile !== 'N/A' && mobile.replace(/\s/g, '').length !== 10) {
    errors.push('Mobile number must be 10 digits');
  }

  if (!consumer.Address) errors.push('Address is required');
  if (!consumer.agency) errors.push('Agency is required');

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Usage:
const result = validateConsumer(consumer);
if (!result.isValid) {
  console.error('Validation failed:', result.errors);
}

// 12. CREATING MOCK DATA FOR TESTING
// ============================================

function createMockConsumer() {
  return {
    'SL NO': 1,
    'Consumer Id': 1.32010983E8,
    'Name': 'TEST CONSUMER',
    'Address': 'Test Address, City',
    'Class': 'D',
    'Device': 'P1429243',
    '· Due Date Range': '04.07.2025-24.03.2026',
    'Outstanding Dues': 13198.68,
    'Mobile Number': 8.240900271E9,
    'agency': 'Annapurna'
  };
}

// Create 10 mock consumers
const mockConsumers = Array.from({ length: 10 }, (_, i) => ({
  ...createMockConsumer(),
  'SL NO': i + 1,
  'Consumer Id': 1.32010983E8 + i,
  'Name': `CONSUMER ${String.fromCharCode(65 + i)}`
}));

// 13. INTEGRATION WITH REACT HOOKS
// ============================================

import { useState, useEffect } from 'react';

function ConsumerManager() {
  const [consumers, setConsumers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Filter whenever search term changes
    const result = consumers.filter(c =>
      c.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatConsumerId(c['Consumer Id']).includes(searchTerm)
    );
    setFiltered(result);
  }, [searchTerm, consumers]);

  return (
    <>
      <input
        placeholder="Search by name or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <p>Found: {filtered.length} consumers</p>
      
      {filtered.map(c => (
        <div key={formatConsumerId(c['Consumer Id'])}>
          <h4>{c.Name}</h4>
          <p>ID: {formatConsumerId(c['Consumer Id'])}</p>
          <p>Mobile: {formatMobileNumber(c['Mobile Number'])}</p>
          <p>Dues: {formatCurrency(c['Outstanding Dues'])}</p>
        </div>
      ))}
    </>
  );
}

// 14. ADVANCED: CUSTOM HOOKS
// ============================================

function useConsumerData(file) {
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        // Parse file and set consumers
        setConsumers(parsedData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  return { consumers, loading, error };
}

// Usage:
function MyComponent({ file }) {
  const { consumers, loading, error } = useConsumerData(file);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return <ConsumerListTable consumers={consumers} />;
}

// ============================================
// END OF QUICK REFERENCE
// ============================================
