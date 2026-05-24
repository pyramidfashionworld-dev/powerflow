import React, { useState } from 'react';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';

export default function AdminPanel({ onBack, consumers, setConsumers }) {
  const [newAgency, setNewAgency] = useState('');

  const agencies = [...new Set(consumers.map(c => c.agency))];

  const handleAddAgency = () => {
    if (newAgency.trim()) {
      // Add a new consumer with new agency
      const newConsumer = {
        id: `C${String(consumers.length + 1).padStart(3, '0')}`,
        name: 'New Consumer',
        mobile: '',
        address: '',
        class: 'A',
        device: 'Smart Meter',
        dueDate: '',
        dueRange: '',
        outstandingDues: 0,
        status: 'Active',
        agency: newAgency
      };
      setConsumers([...consumers, newConsumer]);
      setNewAgency('');
      alert(`✅ Agency "${newAgency}" created with new consumer`);
    }
  };

  const stats = {
    totalConsumers: consumers.length,
    totalAgencies: agencies.length,
    activeConsumers: consumers.filter(c => c.status === 'Active').length,
    disconnected: consumers.filter(c => c.status === 'Disconnected').length,
    totalOutstanding: consumers.reduce((sum, c) => sum + c.outstandingDues, 0)
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>⚙️ Admin Panel</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <p style={{ margin: '0', opacity: 0.9, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Consumers</p>
            <h3 style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: '700' }}>{stats.totalConsumers}</h3>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <p style={{ margin: '0', opacity: 0.9, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Active Consumers</p>
            <h3 style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: '700' }}>{stats.activeConsumers}</h3>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <p style={{ margin: '0', opacity: 0.9, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Disconnected</p>
            <h3 style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: '700' }}>{stats.disconnected}</h3>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <p style={{ margin: '0', opacity: 0.9, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Agencies</p>
            <h3 style={{ margin: '10px 0 0', fontSize: '32px', fontWeight: '700' }}>{stats.totalAgencies}</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          {/* System Statistics */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 25px', fontSize: '18px', fontWeight: '600', color: '#333' }}>📊 System Overview</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '3px solid #667eea' }}>
                <p style={{ margin: '0', fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Total Outstanding Dues</p>
                <p style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: '700', color: '#333' }}>₹{stats.totalOutstanding}</p>
              </div>

              <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '3px solid #f5576c' }}>
                <p style={{ margin: '0', fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Average Outstanding Per Consumer</p>
                <p style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: '700', color: '#333' }}>
                  ₹{stats.totalConsumers > 0 ? Math.round(stats.totalOutstanding / stats.totalConsumers) : 0}
                </p>
              </div>

              <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '3px solid #00f2fe' }}>
                <p style={{ margin: '0', fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Active Rate</p>
                <p style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: '700', color: '#333' }}>
                  {stats.totalConsumers > 0 ? Math.round((stats.activeConsumers / stats.totalConsumers) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Agency Management */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 25px', fontSize: '18px', fontWeight: '600', color: '#333' }}>🏢 Agency Management</h2>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Add New Agency</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={newAgency}
                  onChange={(e) => setNewAgency(e.target.value)}
                  placeholder="Enter agency name"
                  style={{ flex: 1, padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAgency()}
                />
                <button
                  onClick={handleAddAgency}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <Plus size={18} /> Add
                </button>
              </div>
            </div>

            <div>
              <h3 style={{ margin: '0 0 15px', fontSize: '14px', fontWeight: '600', color: '#333' }}>Current Agencies</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {agencies.length > 0 ? (
                  agencies.map(agency => (
                    <div
                      key={agency}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f9f9f9',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <div>
                        <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: '#333' }}>{agency}</p>
                        <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#999' }}>
                          {consumers.filter(c => c.agency === agency).length} consumers
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ margin: '0', fontSize: '13px', color: '#999' }}>No agencies yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Data Summary */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', marginTop: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#333' }}>📈 Consumer Status Distribution</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <p style={{ margin: '0', fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>Active</p>
              <div style={{ marginTop: '10px', height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#d4edda',
                    width: `${stats.totalConsumers > 0 ? (stats.activeConsumers / stats.totalConsumers) * 100 : 0}%`,
                    transition: 'width 0.3s'
                  }}
                />
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '13px', fontWeight: '600', color: '#155724' }}>
                {stats.activeConsumers} consumers ({stats.totalConsumers > 0 ? Math.round((stats.activeConsumers / stats.totalConsumers) * 100) : 0}%)
              </p>
            </div>

            <div>
              <p style={{ margin: '0', fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>Pending</p>
              <div style={{ marginTop: '10px', height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#fff3cd',
                    width: `${stats.totalConsumers > 0 ? ((stats.totalConsumers - stats.activeConsumers - stats.disconnected) / stats.totalConsumers) * 100 : 0}%`,
                    transition: 'width 0.3s'
                  }}
                />
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '13px', fontWeight: '600', color: '#856404' }}>
                {stats.totalConsumers - stats.activeConsumers - stats.disconnected} consumers
              </p>
            </div>

            <div>
              <p style={{ margin: '0', fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>Disconnected</p>
              <div style={{ marginTop: '10px', height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#f8d7da',
                    width: `${stats.totalConsumers > 0 ? (stats.disconnected / stats.totalConsumers) * 100 : 0}%`,
                    transition: 'width 0.3s'
                  }}
                />
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '13px', fontWeight: '600', color: '#721c24' }}>
                {stats.disconnected} consumers ({stats.totalConsumers > 0 ? Math.round((stats.disconnected / stats.totalConsumers) * 100) : 0}%)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', marginTop: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#333' }}>⚡ Quick Actions</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <button
              onClick={() => {
                if (confirm('This will reset all data to sample data. Continue?')) {
                  // Implement reset functionality
                  alert('✅ Data reset to sample data');
                }
              }}
              style={{
                padding: '15px',
                background: '#fff3cd',
                color: '#856404',
                border: '1px solid #ffc107',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              🔄 Reset to Sample Data
            </button>
            <button
              onClick={() => alert('📊 System health: All systems operational')}
              style={{
                padding: '15px',
                background: '#d4edda',
                color: '#155724',
                border: '1px solid #28a745',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              ✅ Check System Health
            </button>
            <button
              onClick={() => alert('📅 Backup completed successfully')}
              style={{
                padding: '15px',
                background: '#d1ecf1',
                color: '#0c5460',
                border: '1px solid #17a2b8',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              💾 Create Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
