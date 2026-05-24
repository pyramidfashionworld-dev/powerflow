import React, { useState } from 'react';
import FileParserService from '../services/fileParserService';

export default function DisconnectionModule() {
  const [consumers, setConsumers] = useState([
    {
      id: 'CON001',
      name: 'Rajesh Kumar',
      status: 'Disconnected',
      area: 'Kolkata - North',
      consumerNo: '12345678',
      address: '42, Chowringhee Road, Kolkata',
      mobile: '9876543210',
      email: 'rajesh@example.com',
      billAmount: '₹4,250',
      lastBillDate: '2024-04-15',
      disconnectionReason: 'Non-payment',
      disconnectionDate: '2024-05-10',
      daysDisconnected: '14'
    },
    {
      id: 'CON002',
      name: 'Priya Singh',
      status: 'Disconnected',
      area: 'Kolkata - South',
      consumerNo: '12345679',
      address: '78, Park Street, Kolkata',
      mobile: '9876543211',
      email: 'priya@example.com',
      billAmount: '₹3,800',
      lastBillDate: '2024-04-10',
      disconnectionReason: 'Meter Fault',
      disconnectionDate: '2024-05-08',
      daysDisconnected: '16'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('🚀 Uploading file:', file.name);
      FileParserService.parseFile(file)
        .then(data => {
          console.log('✅ File parsed, adding', data.length, 'consumers');
          if (data && data.length > 0) {
            setConsumers(prev => {
              const updated = [...prev, ...data];
              console.log('📊 Updated consumers count:', updated.length);
              return updated;
            });
            alert(`✅ Successfully imported ${data.length} consumers!`);
          } else {
            alert('⚠️ File is empty or has no valid data rows');
          }
        })
        .catch(error => {
          console.error('❌ Upload error:', error);
          alert(`❌ Error uploading file: ${error.message}`);
        });
    }
    // Reset file input
    event.target.value = '';
  };

  const filteredConsumers = consumers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.consumerNo.includes(searchTerm) ||
    c.mobile.includes(searchTerm)
  );

  const toggleComparison = (id) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter(x => x !== id));
    } else if (selectedForComparison.length < 2) {
      setSelectedForComparison([...selectedForComparison, id]);
    }
  };

  const handleDelete = (id) => {
    setConsumers(consumers.filter(c => c.id !== id));
  };

  const handleExport = () => {
    FileParserService.exportToCSV(filteredConsumers);
  };

  const startEdit = (consumer) => {
    setEditingId(consumer.id);
    setEditData({ ...consumer });
  };

  const saveEdit = () => {
    setConsumers(consumers.map(c => c.id === editingId ? editData : c));
    setEditingId(null);
  };

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', color: '#1a202c' }}>
          ⚡ Disconnection Management
        </h1>
        <p style={{ fontSize: '14px', color: '#718096', margin: '0' }}>
          {filteredConsumers.length} disconnected consumers in system
        </p>
      </div>

      {/* Comparison View */}
      {selectedForComparison.length === 2 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '2px solid #667eea'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0', color: '#1a202c' }}>
              📊 Consumer Comparison
            </h2>
            <button
              onClick={() => setSelectedForComparison([])}
              style={{
                background: '#ef5350',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              ✕ Clear Comparison
            </button>
          </div>

          {/* Comparison Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            {selectedForComparison.map(id => {
              const consumer = consumers.find(c => c.id === id);
              return (
                <div key={id} style={{
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ebf0 100%)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #cbd5e0' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0', color: '#1a202c' }}>
                      {consumer.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#718096', margin: '0' }}>
                      Consumer ID: {consumer.consumerNo}
                    </p>
                  </div>

                  <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
                      <strong style={{ color: '#4a5568' }}>Status:</strong>
                      <span style={{
                        color: '#ef5350',
                        fontWeight: '600',
                        padding: '4px 8px',
                        background: '#ffebee',
                        borderRadius: '4px',
                        display: 'inline-block',
                        width: 'fit-content'
                      }}>
                        {consumer.status}
                      </span>

                      <strong style={{ color: '#4a5568' }}>Area:</strong>
                      <span>{consumer.area}</span>

                      <strong style={{ color: '#4a5568' }}>Address:</strong>
                      <span>{consumer.address}</span>

                      <strong style={{ color: '#4a5568' }}>Mobile:</strong>
                      <span>{consumer.mobile}</span>

                      <strong style={{ color: '#4a5568' }}>Email:</strong>
                      <span>{consumer.email}</span>

                      <strong style={{ color: '#4a5568' }}>Bill Amount:</strong>
                      <span style={{ color: '#d97706', fontWeight: '600' }}>{consumer.billAmount}</span>

                      <strong style={{ color: '#4a5568' }}>Last Bill:</strong>
                      <span>{consumer.lastBillDate}</span>

                      <strong style={{ color: '#4a5568' }}>Disconnection Reason:</strong>
                      <span>{consumer.disconnectionReason}</span>

                      <strong style={{ color: '#4a5568' }}>Disconnected Since:</strong>
                      <span>{consumer.disconnectionDate}</span>

                      <strong style={{ color: '#4a5568' }}>Days Disconnected:</strong>
                      <span style={{ color: '#ef5350', fontWeight: '600' }}>{consumer.daysDisconnected} days</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="🔍 Search by name, consumer ID, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <label style={{
          padding: '10px 16px',
          background: '#667eea',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background 0.3s'
        }}
          onMouseOver={(e) => e.target.style.background = '#5568d3'}
          onMouseOut={(e) => e.target.style.background = '#667eea'}
        >
          📤 Upload CSV/Excel
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>

        <button
          onClick={handleExport}
          style={{
            padding: '10px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = '#059669'}
          onMouseOut={(e) => e.target.style.background = '#10b981'}
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Consumer Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
        gap: '20px'
      }}>
        {filteredConsumers.map(consumer => (
          <div
            key={consumer.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: selectedForComparison.includes(consumer.id) ? '2px solid #667eea' : '1px solid #e2e8f0',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Comparison Checkbox */}
            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <input
                type="checkbox"
                checked={selectedForComparison.includes(consumer.id)}
                onChange={() => toggleComparison(consumer.id)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Consumer Header */}
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 6px 0', color: '#1a202c' }}>
                {consumer.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#718096', margin: '0' }}>
                Consumer ID: {consumer.consumerNo}
              </p>
            </div>

            {/* Consumer Details */}
            <div style={{ fontSize: '13px', marginBottom: '20px', lineHeight: '1.8' }}>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#4a5568' }}>Status: </strong>
                <span style={{
                  color: '#ef5350',
                  fontWeight: '600',
                  padding: '2px 6px',
                  background: '#ffebee',
                  borderRadius: '4px'
                }}>
                  {consumer.status}
                </span>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#4a5568' }}>Area: </strong>
                <span>{consumer.area}</span>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#4a5568' }}>Address: </strong>
                <span>{consumer.address}</span>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#4a5568' }}>Mobile: </strong>
                <span>{consumer.mobile}</span>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#4a5568' }}>Email: </strong>
                <span>{consumer.email}</span>
              </div>

              <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                background: '#f9fafb',
                padding: '12px',
                borderRadius: '6px'
              }}>
                <div style={{ marginBottom: '6px' }}>
                  <strong style={{ color: '#d97706' }}>Outstanding Bill: </strong>
                  <span style={{ fontWeight: '600', fontSize: '16px', color: '#d97706' }}>
                    {consumer.billAmount}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#718096' }}>
                  Last bill dated {consumer.lastBillDate}
                </div>
              </div>

              <div style={{ marginTop: '12px', fontSize: '12px', color: '#718096' }}>
                <strong>Disconnection Reason: </strong>{consumer.disconnectionReason}
              </div>

              <div style={{ marginTop: '6px', fontSize: '12px', color: '#ef5350', fontWeight: '500' }}>
                <strong>Disconnected for: </strong>{consumer.daysDisconnected} days
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '10px',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <button
                onClick={() => startEdit(consumer)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = '#5568d3'}
                onMouseOut={(e) => e.target.style.background = '#667eea'}
              >
                ✎ Edit
              </button>

              <button
                onClick={() => handleDelete(consumer.id)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: '#ef5350',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = '#e53935'}
                onMouseOut={(e) => e.target.style.background = '#ef5350'}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingId && (
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
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 20px 0', color: '#1a202c' }}>
              Edit Consumer Details
            </h2>

            <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
              {Object.keys(editData).filter(k => k !== 'id').map(key => (
                <div key={key}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '5px',
                    color: '#4a5568',
                    textTransform: 'capitalize'
                  }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    value={editData[key]}
                    onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={saveEdit}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                ✓ Save Changes
              </button>
              <button
                onClick={() => setEditingId(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
