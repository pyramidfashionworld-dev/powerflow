import * as XLSX from 'xlsx';

const FileParserService = {
  parseFile: (file) => {
    return new Promise((resolve, reject) => {
      console.log('📁 Starting file parse:', file.name, file.size, 'bytes');
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target.result;
          console.log('✅ File read successfully');

          if (file.name.endsWith('.csv')) {
            console.log('📄 Parsing as CSV...');
            const text = typeof data === 'string' ? data : new TextDecoder().decode(data);
            const rows = text.split('\n').filter(row => row.trim());
            
            if (rows.length < 2) {
              throw new Error('CSV file must have headers and at least one data row');
            }

            const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
            console.log('📋 Headers found:', headers);

            const consumers = [];
            for (let i = 1; i < rows.length; i++) {
              const values = rows[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
              if (values.some(v => v)) { // Skip empty rows
                const consumer = { id: `CON${Math.random().toString(36).substr(2, 9)}` };
                headers.forEach((header, index) => {
                  consumer[header] = values[index] || '';
                });
                consumers.push(consumer);
              }
            }
            console.log('✅ CSV parsed successfully:', consumers.length, 'rows');
            resolve(consumers);

          } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            console.log('📊 Parsing as Excel...');
            try {
              const workbook = XLSX.read(data, { type: 'array' });
              console.log('📋 Sheets found:', workbook.SheetNames);
              
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const rawData = XLSX.utils.sheet_to_json(worksheet);

              if (rawData.length === 0) {
                throw new Error('Excel sheet is empty or has no data rows');
              }

              console.log('📊 Raw data from Excel:', rawData.length, 'rows');
              console.log('First row:', rawData[0]);

              const consumers = rawData.map((row, idx) => {
                // Normalize header names (handle variations)
                const normalizeKey = (key) => {
                  const lowerKey = String(key).toLowerCase().trim();
                  const mapping = {
                    'name': 'name',
                    'status': 'status',
                    'area': 'area',
                    'consumer no': 'consumerNo',
                    'consumerno': 'consumerNo',
                    'id': 'consumerNo',
                    'address': 'address',
                    'mobile': 'mobile',
                    'phone': 'mobile',
                    'email': 'email',
                    'bill amount': 'billAmount',
                    'billamount': 'billAmount',
                    'amount': 'billAmount',
                    'last bill date': 'lastBillDate',
                    'lastbilldate': 'lastBillDate',
                    'disconnection reason': 'disconnectionReason',
                    'reason': 'disconnectionReason',
                    'disconnection date': 'disconnectionDate',
                    'disconnectiondate': 'disconnectionDate',
                    'days disconnected': 'daysDisconnected',
                    'days': 'daysDisconnected',
                    'daysdisconnected': 'daysDisconnected'
                  };
                  return mapping[lowerKey] || key;
                };

                const consumer = { 
                  id: `CON${Math.random().toString(36).substr(2, 9)}`,
                  name: '',
                  status: 'Active',
                  area: '',
                  consumerNo: '',
                  address: '',
                  mobile: '',
                  email: '',
                  billAmount: '₹0',
                  lastBillDate: '',
                  disconnectionReason: '',
                  disconnectionDate: '',
                  daysDisconnected: '0'
                };

                // Map all properties with normalized keys
                Object.keys(row).forEach(key => {
                  const normalizedKey = normalizeKey(key);
                  const value = row[key];
                  if (consumer.hasOwnProperty(normalizedKey)) {
                    consumer[normalizedKey] = value || '';
                  }
                });

                return consumer;
              });

              console.log('✅ Excel parsed successfully:', consumers.length, 'consumers');
              console.log('Sample consumer:', consumers[0]);
              resolve(consumers);

            } catch (excelError) {
              console.error('❌ Excel parsing error:', excelError);
              throw excelError;
            }
          } else {
            throw new Error('Unsupported file format. Please upload CSV or Excel file.');
          }
        } catch (error) {
          console.error('❌ Parse error:', error.message);
          reject(error);
        }
      };

      reader.onerror = () => {
        console.error('❌ FileReader error');
        reject(new Error('Error reading file'));
      };

      // Read file based on type
      if (file.name.endsWith('.csv')) {
        console.log('🔄 Reading as text...');
        reader.readAsText(file);
      } else {
        console.log('🔄 Reading as array buffer...');
        reader.readAsArrayBuffer(file);
      }
    });
  },

  exportToCSV: (data) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    console.log('📤 Exporting', data.length, 'rows to CSV');

    // Create headers
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header] || '';
          // Escape quotes and wrap in quotes if contains comma
          return value.toString().includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ].join('\n');

    // Download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `consumers-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    console.log('✅ CSV exported successfully');
  },

  exportToExcel: (data) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    console.log('📤 Exporting', data.length, 'rows to Excel');

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Consumers');

    // Auto-fit column widths
    const maxWidth = Math.max(...data.map(row => JSON.stringify(row).length));
    worksheet['!cols'] = Object.keys(data[0]).map(() => ({
      wch: Math.min(maxWidth / data.length + 5, 50)
    }));

    XLSX.writeFile(workbook, `consumers-${new Date().toISOString().split('T')[0]}.xlsx`);

    console.log('✅ Excel exported successfully');
  }
};

export default FileParserService;
