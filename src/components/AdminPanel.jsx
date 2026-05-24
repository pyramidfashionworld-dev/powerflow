import React, { useState } from 'react';

export default function AdminPanel() {
  const [users, setUsers] = useState([
    {
      id: 'USR001',
      name: 'Admin User',
      email: 'admin@powerflow.com',
      role: 'Admin',
      status: 'Active',
      joinDate: '2024-01-15',
      lastLogin: '2024-05-23'
    },
    {
      id: 'USR002',
      name: 'Manager User',
      email: 'manager@powerflow.com',
      role: 'Manager',
      status: 'Active',
      joinDate: '2024-02-20',
      lastLogin: '2024-05-22'
    },
    {
      id: 'USR003',
      name: 'Staff User',
      email: 'staff@powerflow.com',
      role: 'Staff',
      status: 'Active',
      joinDate: '2024-03-10',
      lastLogin: '2024-05-21'
    }
  ]);

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Staff',
    password: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('⚠️ Please fill all required fields');
      return;
    }

    const user = {
      id: `USR${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: '-'
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'Staff', password: '' });
    setShowAddUserForm(false);
    alert(`✅ User "${newUser.name}" added successfully!`);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      alert('✅ User deleted successfully');
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
        : u
    ));
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', color: '#1a202c' }}>
          ⚙️ Admin Panel
        </h1>
        <p style={{ fontSize: '14px', color: '#718096', margin: '0' }}>
          System settings and user management
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {[
          { label: 'Total Users', value: users.length, color: '#667eea' },
          { label: 'Active Users', value: users.filter(u => u.status === 'Active').length, color: '#10b981' },
          { label: 'Admins', value: users.filter(u => u.role === 'Admin').length, color: '#8b5cf6' },
          { label: 'Managers', value: users.filter(u => u.role === 'Manager').length, color: '#f59e0b' }
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            borderLeft: `4px solid ${stat.color}`
          }}>
            <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 8px 0', fontWeight: '500' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '28px', fontWeight: '700', margin: '0', color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="🔍 Search by name, email, or role..."
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

        <button
          onClick={() => setShowAddUserForm(!showAddUserForm)}
          style={{
            padding: '10px 16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = '#5568d3'}
          onMouseOut={(e) => e.target.style.background = '#667eea'}
        >
          {showAddUserForm ? '✕ Cancel' : '➕ Add User'}
        </button>
      </div>

      {/* Add User Form */}
      {showAddUserForm && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '2px solid #667eea'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: '#1a202c' }}>
            Add New User
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#4a5568'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter full name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#4a5568'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#4a5568'
              }}>
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option>Admin</option>
                <option>Manager</option>
                <option>Staff</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#4a5568'
              }}>
                Password *
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAddUser}
              style={{
                padding: '10px 24px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.target.style.background = '#059669'}
              onMouseOut={(e) => e.target.style.background = '#10b981'}
            >
              ✓ Add User
            </button>
            <button
              onClick={() => {
                setShowAddUserForm(false);
                setNewUser({ name: '', email: '', role: 'Staff', password: '' });
              }}
              style={{
                padding: '10px 24px',
                background: '#e2e8f0',
                color: '#4a5568',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#1a202c' }}>Name</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#1a202c' }}>Email</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#1a202c' }}>Role</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#1a202c' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#1a202c' }}>Join Date</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#1a202c' }}>Last Login</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#1a202c' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#718096' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', color: '#1a202c', fontWeight: '500' }}>{user.name}</td>
                    <td style={{ padding: '16px', color: '#718096' }}>{user.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        background: user.role === 'Admin' ? '#ede9fe' : user.role === 'Manager' ? '#fef3c7' : '#e0f2fe',
                        color: user.role === 'Admin' ? '#7c3aed' : user.role === 'Manager' ? '#d97706' : '#0284c7',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        background: user.status === 'Active' ? '#dcfce7' : '#fee2e2',
                        color: user.status === 'Active' ? '#16a34a' : '#dc2626',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#718096' }}>{user.joinDate}</td>
                    <td style={{ padding: '16px', color: '#718096' }}>{user.lastLogin}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        style={{
                          padding: '6px 12px',
                          background: user.status === 'Active' ? '#fca5a5' : '#86efac',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          marginRight: '8px',
                          transition: 'background 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.opacity = '0.9'}
                        onMouseOut={(e) => e.target.style.opacity = '1'}
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#ef5350',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'background 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#e53935'}
                        onMouseOut={(e) => e.target.style.background = '#ef5350'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Info */}
      <div style={{
        marginTop: '40px',
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: '#1a202c' }}>
          System Information
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {[
            { label: 'System Version', value: 'v2.0.0' },
            { label: 'Database Status', value: 'Connected' },
            { label: 'API Status', value: 'Active' },
            { label: 'Last Backup', value: '2024-05-23 10:30 AM' },
            { label: 'System Uptime', value: '99.9%' },
            { label: 'Total Storage', value: '500 GB Available' }
          ].map((info, idx) => (
            <div key={idx}>
              <p style={{ fontSize: '12px', color: '#718096', margin: '0 0 6px 0', fontWeight: '600' }}>
                {info.label}
              </p>
              <p style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#1a202c' }}>
                {info.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
