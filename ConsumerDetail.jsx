import React, { useState } from 'react';
import { ChevronLeft, Edit2, Save, X } from 'lucide-react';

export default function ConsumerDetail({ consumer, onBack, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(consumer);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(consumer);
    setIsEditing(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Consumer Details</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {/* Top Section - Basic Info */}
          <div style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', padding: '30px', borderBottom: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: '0', fontSize: '28px', fontWeight: '600', color: '#333' }}>{formData.name}</h2>
                <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#666' }}>ID: {formData.id}</p>
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                  <Edit2 size={18} /> Edit
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <p style={{ margin: '0', fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Status</p>
                <div style={{
                  marginTop: '8px',
                  display: 'inline-block',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: formData.status === 'Active' ? '#d4edda' : formData.status === 'Pending' ? '#fff3cd' : '#f8d7da',
                  color: formData.status === 'Active' ? '#155724' : formData.status === 'Pending' ? '#856404' : '#721c24'
                }}>
                  {formData.status}
                </div>
              </div>
              <div>
                <p style={{ margin: '0', fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Agency</p>
                <p style={{ margin: '8px 0 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{formData.agency}</p>
              </div>
              <div>
                <p style={{ margin: '0', fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Outstanding Dues</p>
                <p style={{ margin: '8px 0 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>₹{formData.outstandingDues}</p>
              </div>
            </div>
          </div>

          {/* Editable Fields Section */}
          <div style={{ padding: '30px' }}>
            <h3 style={{ margin: '0 0 25px', fontSize: '18px', fontWeight: '600', color: '#333' }}>📋 Complete Information</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                ) : (
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{formData.name}</p>
                )}
              </div>

              {/* Consumer ID */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Consumer ID</label>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{formData.id}</p>
              </div>

              {/* Mobile */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Mobile Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                ) : (
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{formData.mobile}</p>
                )}
              </div>

              {/* Address */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Address</label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', minHeight: '100px', fontFamily: 'inherit' }}
                  />
                ) : (
                  <p style={{ margin: '0', fontSize: '14px', color: '#333', lineHeight: '1.6' }}>{formData.address}</p>
                )}
              </div>

              {/* Class */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Consumer Class</label>
                {isEditing ? (
                  <select
                    value={formData.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                ) : (
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{formData.class}</p>
                )}
              </div>

              {/* Device */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Device Type</label>
                {isEditing ? (
                  <select
                    value={formData.device}
                    onChange={(e) => handleInputChange('device', e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  >
                    <option value="Smart Meter">Smart Meter</option>
                    <option value="Analog Meter">Analog Meter</option>
                    <option value="Digital Meter">Digital Meter</option>
                  </select>
                ) : (
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{formData.device}</p>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Due Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                ) : (
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{formData.dueDate}</p>
                )}
              </div>

              {/* Due Range */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Due Date Range</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.dueRange}
                    onChange={(e) => handleInputChange('dueRange', e.target.value)}
                    placeholder="e.g., 30 days"
                    style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                ) : (
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{formData.dueRange}</p>
                )}
              </div>

              {/* Outstanding Dues */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Outstanding Dues</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.outstandingDues}
                    onChange={(e) => handleInputChange('outstandingDues', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                ) : (
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#d32f2f' }}>₹{formData.outstandingDues}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Status</label>
                {isEditing ? (
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Disconnected">Disconnected</option>
                  </select>
                ) : (
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: formData.status === 'Active' ? '#d4edda' : formData.status === 'Pending' ? '#fff3cd' : '#f8d7da',
                    color: formData.status === 'Active' ? '#155724' : formData.status === 'Pending' ? '#856404' : '#721c24'
                  }}>
                    {formData.status}
                  </div>
                )}
              </div>

              {/* Agency */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Agency</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.agency}
                    onChange={(e) => handleInputChange('agency', e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                ) : (
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{formData.agency}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '30px', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCancel}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#f5f5f5', color: '#333', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
