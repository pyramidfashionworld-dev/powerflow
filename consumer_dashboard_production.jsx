import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Search, MapPin, Phone, Zap, Calendar, DollarSign, BarChart3, Upload, AlertCircle } from 'lucide-react';

export default function ConsumerDashboard() {
  const [consumers, setConsumers] = useState([]);
  const [filteredConsumers, setFilteredConsumers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [stats, setStats] = useState({
    totalConsumers: 0,
    totalOutstandingDues: 0,
    avgOutstandingDues: 0
  });

  // Try multiple ways to load the Excel file
  useEffect(() => {
    loadExcelFile();
  }, []);

  const loadExcelFile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try different possible paths for the Excel file
      const possiblePaths = [
        '/Maydisc26_1___2_.xlsx',  // public folder
        'https://cdn.example.com/Maydisc26_1___2_.xlsx', // Update with your CDN URL if using one
        '/mnt/user-data/uploads/Maydisc26_1___2_.xlsx' // Local development
      ];

      let response;
      let success = false;

      for (const path of possiblePaths) {
        try {
          response = await fetch(path);
          if (response.ok) {
            success = true;
            break;
          }
        } catch (err) {
          // Try next path
          continue;
        }
      }

      if (!success) {
        throw new Error('Excel file not found. Please upload your Excel file using the upload button below.');
      }

      const arrayBuffer = await response.arrayBuffer();
      processExcelData(arrayBuffer);
    } catch (error) {
      console.error('Error loading Excel file:', error);
      setError(error.message || 'Failed to load data. Please upload your Excel file.');
      setLoading(false);
    }
  };

  const processExcelData = (arrayBuffer) => {
    try {
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Process and clean the data
      const processedData = jsonData
        .map((row, index) => ({
          id: row['Consumer Id']?.toString() || '',
          name: row['Name']?.trim() || 'N/A',
          address: row['Address']?.trim() || 'N/A',
          class: row['Class'] || 'N/A',
          device: row['Device'] || 'N/A',
          dueDateRange: row['· Due Date Range'] || 'N/A',
          outstandingDues: parseFloat(row['Outstanding Dues']) || 0,
          mobileNumber: row['Mobile Number']?.toString() || 'N/A',
          agency: row['agency'] || 'N/A',
          slNo: row['SL NO'] || index + 1
        }))
        .filter(item => item.id && item.name) // Remove empty rows
        .slice(0, 1000); // Limit to 1000 for performance

      setConsumers(processedData);
      setFilteredConsumers(processedData);
      setDataLoaded(true);

      // Calculate statistics
      const totalDues = processedData.reduce((sum, c) => sum + (c.outstandingDues || 0), 0);
      setStats({
        totalConsumers: processedData.length,
        totalOutstandingDues: totalDues,
        avgOutstandingDues: processedData.length > 0 ? totalDues / processedData.length : 0
      });

      setLoading(false);
    } catch (error) {
      console.error('Error processing Excel file:', error);
      setError('Error processing Excel file. Please ensure it has the correct format.');
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const arrayBuffer = await file.arrayBuffer();
      processExcelData(arrayBuffer);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to process the uploaded file. Please check the format.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      setFilteredConsumers(consumers);
    } else {
      const filtered = consumers.filter(consumer =>
        consumer.name.toLowerCase().includes(term) ||
        consumer.id.toLowerCase().includes(term) ||
        consumer.mobileNumber.toLowerCase().includes(term) ||
        consumer.address.toLowerCase().includes(term) ||
        consumer.agency.toLowerCase().includes(term)
      );
      setFilteredConsumers(filtered);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Consumer Management Dashboard</h1>
          <p className="text-slate-300">View and manage all consumer accounts</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Unable to Load Default Data</h3>
              <p className="text-red-700 text-sm mb-4">{error}</p>
              <label className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Excel File</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {dataLoaded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Consumers</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalConsumers.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-12 h-12 text-blue-500 opacity-30" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Outstanding Dues</p>
                  <p className="text-3xl font-bold text-gray-900">₹{stats.totalOutstandingDues.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                </div>
                <DollarSign className="w-12 h-12 text-red-500 opacity-30" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Avg Outstanding Due</p>
                  <p className="text-3xl font-bold text-gray-900">₹{stats.avgOutstandingDues.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                </div>
                <Zap className="w-12 h-12 text-green-500 opacity-30" />
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {dataLoaded && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, consumer ID, phone, or address..."
                value={searchTerm}
                onChange={handleSearch}
                className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
              />
              {searchTerm && (
                <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                  {filteredConsumers.length} results
                </span>
              )}
            </div>
          </div>
        )}

        {/* Upload Button (always visible) */}
        {!dataLoaded && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center mb-8">
            <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Loaded</h2>
            <p className="text-gray-600 mb-6">Upload your Excel file to get started</p>
            <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors text-lg font-semibold">
              <Upload className="w-5 h-5" />
              <span>Choose Excel File</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading consumer data...</p>
          </div>
        )}

        {/* Consumer Cards Grid */}
        {dataLoaded && !loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConsumers.map((consumer, index) => (
                <div
                  key={`${consumer.id}-${index}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s`, animation: 'fadeInUp 0.6s ease-out forwards' }}
                >
                  {/* Card Header with Name */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{consumer.name}</h3>
                        <p className="text-blue-100 text-sm">ID: {consumer.id}</p>
                      </div>
                      <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-semibold">
                        Connected
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    {/* Agency */}
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                      <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-600 text-xs font-semibold">Agency</p>
                        <p className="text-gray-900 font-medium text-sm">{consumer.agency}</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                      <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-600 text-xs font-semibold">Address</p>
                        <p className="text-gray-900 text-sm line-clamp-2">{consumer.address}</p>
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                      <Phone className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-600 text-xs font-semibold">Mobile</p>
                        <p className="text-gray-900 font-medium text-sm">
                          {consumer.mobileNumber === 'N/A' ? (
                            <span className="text-gray-400">Not Available</span>
                          ) : (
                            consumer.mobileNumber
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Class & Device in Two Columns */}
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <p className="text-gray-600 text-xs font-semibold">Class</p>
                        <p className="text-gray-900 font-medium text-sm bg-blue-50 px-2 py-1 rounded">{consumer.class}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold">Device</p>
                        <p className="text-gray-900 font-medium text-sm bg-purple-50 px-2 py-1 rounded">{consumer.device}</p>
                      </div>
                    </div>

                    {/* Due Date Range */}
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                      <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-600 text-xs font-semibold">Due Date Range</p>
                        <p className="text-gray-900 text-sm">{consumer.dueDateRange}</p>
                      </div>
                    </div>

                    {/* Outstanding Dues */}
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-600 text-xs font-semibold">Outstanding Dues</p>
                        <p className={`text-lg font-bold ${consumer.outstandingDues > 5000 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{consumer.outstandingDues.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredConsumers.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No consumers found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
