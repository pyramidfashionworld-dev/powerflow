import React, { useState, useEffect } from 'react';
import { ChevronDown, Upload, Search, LogOut, Menu, X, Eye, Edit2, Trash2, Download, Plus, Filter } from 'lucide-react';
import ConsumerDetail from './pages/ConsumerDetail';
import AdminPanel from './pages/AdminPanel';
import AgencyModule from './pages/AgencyModule';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [consumers, setConsumers] = useState([]);
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Load sample data on first mount
  useEffect(() => {
    if (!sampleLoaded) {
      const sampleData = [
        {
          id: 'C001',
          name: 'Rajesh Kumar',
          mobile: '9876543210',
          address: '123 Main Street, Kolkata, WB 700001',
          class: 'A',
          device: 'Smart Meter',
          dueDate: '2024-06-30',
          dueRange: '30 days',
          outstandingDues: 5000,
          status: 'Active',
          agency: 'Kolkata North'
        },
        {
          id: 'C002',
          name: 'Priya Singh',
          mobile: '9876543211',
          address: '456 Park Avenue, Bangalore, KA 560001',
          class: 'B',
          device: 'Analog Meter',
          dueDate: '2024-07-15',
          dueRange: '15 days',
          outstandingDues: 2500,
          status: 'Pending',
          agency: 'Bangalore Metro'
        },
        {
          id: 'C003',
          name: 'Amit Patel',
          mobile: '9876543212',
          address: '789 Tech Park, Mumbai, MH 400001',
          class: 'A',
          device: 'Smart Meter',
          dueDate: '2024-08-01',
          dueRange: '60 days',
          outstandingDues: 8500,
          status: 'Disconnected',
          agency: 'Mumbai Central'
        },
        {
          id: 'C004',
          name: 'Neha Desai',
          mobile: '9876543213',
          address: '321 Business Hub, Delhi, DL 110001',
          class: 'C',
          device: 'Smart Meter',
          dueDate: '2024-06-15',
          dueRange: '5 days',
          outstandingDues: 1200,
          status: 'Active',
          agency: 'Delhi North'
        }
      ];
      setConsumers(sampleData);
      setSampleLoaded(true);
    }
  }, [sampleLoaded]);

  const handleLogin = (e) => {
    e.preventDefault();
    if ((loginEmail === 'admin' && loginPassword === 'admin123') ||
        (loginEmail === 'user' && loginPassword === 'user123')) {
      setCurrentUser({ email: loginEmail, role: loginEmail === 'admin' ? 'Admin' : 'User' });
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
    setSelectedConsumer(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split('\n');
        
        if (lines.length < 2) {
          alert('Invalid file format');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const newConsumers = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(',').map(v => v.trim());
          if (values.length < headers.length) continue;

          const consumer = {};
          headers.forEach((header, idx) => {
            consumer[header] = values[idx] || '';
          });

          // Map common header variations
          if (!consumer.id && consumer['consumer id']) consumer.id = consumer['consumer id'];
          if (!consumer.name && consumer['consumer name']) consumer.name = consumer['consumer name'];
          if (!consumer.mobile && consumer['mobile number']) consumer.mobile = consumer['mobile number'];
          if (!consumer.address && consumer['address']) consumer.address = consumer['address'];
          if (!consumer.class && consumer['class']) consumer.class = consumer['class'];
          if (!consumer.device && consumer['device']) consumer.device = consumer['device'];
          if (!consumer.duedate && consumer['due date']) consumer.duedate = consumer['due date'];
          if (!consumer.duerange && consumer['due date range']) consumer.duerange = consumer['due date range'];
          if (!consumer.outstandingdues && consumer['outstanding dues']) consumer.outstandingdues = consumer['outstanding dues'];
          if (!consumer.status && consumer['status']) consumer.status = consumer['status'];
          if (!consumer.agency && consumer['agency']) consumer.agency = consumer['agency'];

          if (consumer.id && consumer.name) {
            newConsumers.push({
              id: consumer.id,
              name: consumer.name,
              mobile: consumer.mobile || '',
              address: consumer.address || '',
              class: consumer.class || '',
              device: consumer.device || '',
              dueDate: consumer.duedate || '',
              dueRange: consumer.duerange || '',
              outstandingDues: consumer.outstandingdues ? parseFloat(consumer.outstandingdues) : 0,
              status: consumer.status || 'Active',
              agency: consumer.agency || 'Unassigned'
            });
          }
        }

        if (newConsumers.length > 0) {
          setConsumers(newConsumers);
          alert(`✅ Uploaded ${newConsumers.length} consumers successfully! Sample data replaced.`);
          setCurrentPage('dashboard');
        } else {
          alert('❌ No valid consumer records found in file');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('❌ Error parsing file: ' + error.message);
      }
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteConsumer = (id) => {
    if (confirm('Are you sure you want to delete this consumer?')) {
      setConsumers(consumers.filter(c => c.id !== id));
      if (selectedConsumer?.id === id) setSelectedConsumer(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['id', 'name', 'mobile', 'address', 'class', 'device', 'dueDate', 'dueRange', 'outstandingDues', 'status', 'agency'];
    const csv = [
      headers.join(','),
      ...filteredConsumers.map(c => 
        headers.map(h => {
          const value = c[h] || '';
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consumers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filteredConsumers = consumers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobile.includes(searchTerm)
  );

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <h1 style={{ margin: '0 0 30px', textAlign: 'center', color: '#333', fontSize: '24px', fontWeight: '600' }}>Powerflow Admin</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <button
              type="submit"
              style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            >
              Login
            </button>
            <p style={{ marginTop: '20px', fontSize: '13px', color: '#666', textAlign: 'center' }}>
              Demo: admin/admin123 or user/user123
            </p>
          </form>
        </div>
      </div>
    );
  }

  if (selectedConsumer) {
    return <ConsumerDetail consumer={selectedConsumer} onBack={() => setSelectedConsumer(null)} onUpdate={(updated) => {
      setConsumers(consumers.map(c => c.id === updated.id ? updated : c));
      setSelectedConsumer(updated);
    }} />;
  }

  if (currentPage === 'admin' && currentUser.role === 'Admin') {
    return <AdminPanel onBack={() => setCurrentPage('dashboard')} consumers={consumers} setConsumers={setConsumers} />;
  }

  if (currentPage === 'agency') {
    return <AgencyModule consumers={consumers} setConsumers={setConsumers} onBack={() => setCurrentPage('dashboard')} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Powerflow Dashboard</h1>
            <p style={{ margin: '5px 0 0', opacity: 0.9, fontSize: '14px' }}>Welcome, {currentUser.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #e0e0e0', padding: '0 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px' }}>
          <button onClick={() => setCurrentPage('dashboard')} style={{ padding: '16px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: currentPage === 'dashboard' ? '600' : '500', color: currentPage === 'dashboard' ? '#667eea' : '#666', borderBottom: currentPage === 'dashboard' ? '3px solid #667eea' : 'none' }}>
            📊 Dashboard
          </button>
          <button onClick={() => setCurrentPage('agency')} style={{ padding: '16px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: currentPage === 'agency' ? '600' : '500', color: currentPage === 'agency' ? '#667eea' : '#666', borderBottom: currentPage === 'agency' ? '3px solid #667eea' : 'none' }}>
            🏢 Agency Management
          </button>
          {currentUser.role === 'Admin' && (
            <button onClick={() => setCurrentPage('admin')} style={{ padding: '16px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: currentPage === 'admin' ? '600' : '500', color: currentPage === 'admin' ? '#667eea' : '#666', borderBottom: currentPage === 'admin' ? '3px solid #667eea' : 'none' }}>
              ⚙️ Admin Panel
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Upload Section */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', marginBottom: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#333' }}>📤 Import Consumer Data</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: '2px dashed #667eea', borderRadius: '8px', cursor: 'pointer', background: '#f9f9ff', transition: 'all 0.3s' }}>
              <Upload size={20} color="#667eea" />
              <span style={{ fontSize: '14px', color: '#667eea', fontWeight: '500' }}>Upload CSV/Excel File</span>
              <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <button onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#333' }}>
              <Download size={20} /> Export CSV
            </button>
          </div>
          <p style={{ margin: '15px 0 0', fontSize: '12px', color: '#999' }}>
            Supported formats: CSV, XLSX, XLS. Required columns: id, name, mobile, address, class, device, dueDate, dueRange, outstandingDues, status, agency
          </p>
        </div>

        {/* Search & Stats */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', marginBottom: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px' }}>
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' }}>
              <p style={{ margin: '0', opacity: 0.9, fontSize: '14px' }}>Total Consumers</p>
              <h3 style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: '600' }}>{consumers.length}</h3>
            </div>
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '8px', color: 'white' }}>
              <p style={{ margin: '0', opacity: 0.9, fontSize: '14px' }}>Active</p>
              <h3 style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: '600' }}>{consumers.filter(c => c.status === 'Active').length}</h3>
            </div>
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', borderRadius: '8px', color: 'white' }}>
              <p style={{ margin: '0', opacity: 0.9, fontSize: '14px' }}>Pending</p>
              <h3 style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: '600' }}>{consumers.filter(c => c.status === 'Pending').length}</h3>
            </div>
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', borderRadius: '8px', color: '#333' }}>
              <p style={{ margin: '0', opacity: 0.9, fontSize: '14px' }}>Disconnected</p>
              <h3 style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: '600' }}>{consumers.filter(c => c.status === 'Disconnected').length}</h3>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
            <input
              type="text"
              placeholder="Search by name, ID, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Consumers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredConsumers.map(consumer => (
            <div key={consumer.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{consumer.name}</h3>
                  <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#999' }}>ID: {consumer.id}</p>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: consumer.status === 'Active' ? '#d4edda' : consumer.status === 'Pending' ? '#fff3cd' : '#f8d7da',
                  color: consumer.status === 'Active' ? '#155724' : consumer.status === 'Pending' ? '#856404' : '#721c24'
                }}>
                  {consumer.status}
                </div>
              </div>

              <div style={{ fontSize: '13px', lineHeight: '1.8', marginBottom: '15px', color: '#666' }}>
                <p style={{ margin: '0' }}><strong>📱</strong> {consumer.mobile}</p>
                <p style={{ margin: '5px 0 0' }}><strong>🏢</strong> {consumer.agency}</p>
                <p style={{ margin: '5px 0 0' }}><strong>💰</strong> ₹{consumer.outstandingDues}</p>
                <p style={{ margin: '5px 0 0' }}><strong>📅</strong> Due: {consumer.dueRange}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => setSelectedConsumer(consumer)}
                  style={{ padding: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={() => handleDeleteConsumer(consumer.id)}
                  style={{ padding: '10px', background: '#f5f5f5', color: '#d32f2f', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredConsumers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <p style={{ fontSize: '16px' }}>No consumers found. Upload a CSV file to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
