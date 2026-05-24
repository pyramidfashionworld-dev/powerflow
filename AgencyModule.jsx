import React, { useState } from 'react';
import { ChevronLeft, Save, X } from 'lucide-react';

export default function AgencyModule({ consumers, setConsumers, onBack }) {
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [editingConsumerId, setEditingConsumerId] = useState(null);
  const [editingStatus, setEditingStatus] = useState('');

  // Get unique agencies
  const agencies = [...new Set(consumers.map(c => c.agency))].sort();
  const agencyConsumers = selectedAgency 
    ? consumers.filter(c => c.agency === selectedAgency)
    : [];

  const handleStatusUpdate = (consumerId, newStatus) => {
    setConsumers(consumers.map(c => 
      c.id === consumerId ? { ...c, status: newStatus } : c
    ));
    setEditingConsumerId(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>🏢 Agency Management</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '25px' }}>
          {/* Left Panel - Agency List */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden', minWidth: '280px', maxWidth: '280px' }}>
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', borderBottom: '1px solid #e0e0e0' }}>
              <h2 style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>📍 All Agencies</h2>
              <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#999' }}>{agencies.length} agencies</p>
            </div>
            <div style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
              {agencies.map(agency => (
                <button
                  key={agency}
                  onClick={() => setSelectedAgency(agency)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: 'none',
                    background: selectedAgency === agency ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                    color: selectedAgency === agency ? 'white' : '#333',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderBottom: '1px solid #e0e0e0',
                    transition: 'all 0.3s',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{agency}</span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: selectedAgency === agency ? 'rgba(255,255,255,0.3)' : '#f0f0f0',
                      color: selectedAgency === agency ? 'white' : '#666'
                    }}>
                      {consumers.filter(c => c.agency === agency).length}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Consumer List for Selected Agency */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            {selectedAgency ? (
              <>
                <div style={{ padding: '25px', background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', borderBottom: '1px solid #e0e0e0' }}>
                  <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '600', color: '#333' }}>
                    {selectedAgency}
                  </h2>
                  <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#666' }}>
                    {agencyConsumers.length} consumers assigned to this agency
                  </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #e0e0e0' }}>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Consumer ID</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Name</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Mobile</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Outstanding Dues</th>
                        <th style={{ padding: '15px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '15px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agencyConsumers.map(consumer => (
                        <tr key={consumer.id} style={{ borderBottom: '1px solid #e0e0e0', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                          <td style={{ padding: '15px', fontSize: '13px', fontWeight: '600', color: '#333' }}>{consumer.id}</td>
                          <td style={{ padding: '15px', fontSize: '13px', color: '#333' }}>{consumer.name}</td>
                          <td style={{ padding: '15px', fontSize: '13px', color: '#666' }}>{consumer.mobile}</td>
                          <td style={{ padding: '15px', fontSize: '13px', fontWeight: '600', color: '#d32f2f' }}>₹{consumer.outstandingDues}</td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            {editingConsumerId === consumer.id ? (
                              <select
                                value={editingStatus}
                                onChange={(e) => setEditingStatus(e.target.value)}
                                autoFocus
                                style={{
                                  padding: '6px 12px',
                                  border: '1px solid #667eea',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  background: 'white',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Disconnected">Disconnected</option>
                              </select>
                            ) : (
                              <div style={{
                                display: 'inline-block',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: consumer.status === 'Active' ? '#d4edda' : consumer.status === 'Pending' ? '#fff3cd' : '#f8d7da',
                                color: consumer.status === 'Active' ? '#155724' : consumer.status === 'Pending' ? '#856404' : '#721c24'
                              }}>
                                {consumer.status}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            {editingConsumerId === consumer.id ? (
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => handleStatusUpdate(consumer.id, editingStatus)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '6px 12px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                  }}
                                >
                                  <Save size={14} /> Save
                                </button>
                                <button
                                  onClick={() => setEditingConsumerId(null)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '6px 12px',
                                    background: '#f5f5f5',
                                    color: '#333',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                  }}
                                >
                                  <X size={14} /> Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingConsumerId(consumer.id);
                                  setEditingStatus(consumer.status);
                                }}
                                style={{
                                  padding: '6px 14px',
                                  background: '#f0f0f0',
                                  color: '#333',
                                  border: '1px solid #e0e0e0',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  transition: 'all 0.2s'
                                }}
                              >
                                Update Status
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {agencyConsumers.length === 0 && (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                    <p>No consumers assigned to this agency</p>
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: '60px 40px', textAlign: 'center', color: '#999' }}>
                <p style={{ fontSize: '16px', margin: '0' }}>👈 Select an agency to view and update consumer status</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
