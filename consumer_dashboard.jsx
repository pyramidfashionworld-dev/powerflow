import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Search, MapPin, Phone, Zap, Calendar, DollarSign, BarChart3 } from 'lucide-react';

export default function ConsumerDashboard() {
  const [consumers, setConsumers] = useState([]);
  const [filteredConsumers, setFilteredConsumers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalConsumers: 0,
    totalOutstandingDues: 0,
    avgOutstandingDues: 0
  });

  useEffect(() => {
    const loadExcelFile = async () => {
      try {
        // Fetch the Excel file from the outputs directory
        const response = await fetch('/mnt/user-data/uploads/Maydisc26_1___2_.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process and clean the data
        const processedData = jsonData.map((row, index) => ({
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
        })).slice(0, 500); // Limit to first 500 for performance

        setConsumers(processedData);
        setFilteredConsumers(processedData);

        // Calculate statistics
        const totalDues = processedData.reduce((sum, c) => sum + (c.outstandingDues || 0), 0);
        setStats({
          totalConsumers: processedData.length,
          totalOutstandingDues: totalDues,
          avgOutstandingDues: totalDues / processedData.length
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading Excel file:', error);
        setLoading(false);
      }
    };

    loadExcelFile();
  }, []);

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
        consumer.address.toLowerCase().includes(term)
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

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalOutstandingDues.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
              </div>
              <DollarSign className="w-12 h-12 text-red-500 opacity-30" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Outstanding Due</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.avgOutstandingDues.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
              </div>
              <Zap className="w-12 h-12 text-green-500 opacity-30" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
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

        {/* Consumer Cards Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading consumer data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConsumers.map((consumer, index) => (
                <div
                  key={consumer.id}
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
                          ₹{consumer.outstandingDues.toLocaleString('en-IN', {maximumFractionDigits: 2})}
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
