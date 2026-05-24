import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const credentials = {
    admin: { email: 'admin', password: 'admin123', role: 'Admin' },
    user: { email: 'user', password: 'user123', role: 'User' }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const cred = credentials[activeTab];

    if (email === cred.email && password === cred.password) {
      onLogin({ email, role: cred.role });
      setError('');
    } else {
      setError('Invalid credentials. Try admin/admin123 or user/user123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '420px',
        padding: '40px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Powerflow
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#718096',
            margin: '0',
            fontWeight: '500'
          }}>
            Admin Control Center
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0',
          marginBottom: '30px',
          borderBottom: '2px solid #e2e8f0'
        }}>
          {['admin', 'user'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setError('');
              }}
              style={{
                flex: 1,
                padding: '14px',
                background: 'none',
                border: 'none',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                color: activeTab === tab ? '#667eea' : '#a0aec0',
                borderBottom: activeTab === tab ? '3px solid #667eea' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {tab === 'admin' ? '🔐 Admin' : '👤 User'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
          {/* Email Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#4a5568'
            }}>
              {activeTab === 'admin' ? 'Admin ID' : 'User ID'}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === 'admin' ? 'admin' : 'user'}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#4a5568'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={activeTab === 'admin' ? 'admin123' : 'user123'}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px',
              border: '1px solid #ef5350'
            }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🚀 Login to Powerflow
          </button>
        </form>

        {/* Helper Text */}
        <div style={{
          background: '#f7fafc',
          padding: '12px 14px',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#718096',
          textAlign: 'center'
        }}>
          <strong>Demo Credentials:</strong>
          <div style={{ marginTop: '6px' }}>
            Admin: <span style={{ fontFamily: 'monospace', color: '#4a5568' }}>admin / admin123</span>
          </div>
          <div>
            User: <span style={{ fontFamily: 'monospace', color: '#4a5568' }}>user / user123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
