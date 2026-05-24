import React, { useState } from 'react';
import './index.css';
import LoginPage from './components/LoginPage';
import DashboardHome from './components/DashboardHome';
import DisconnectionModule from './components/DisconnectionModule';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentModule, setCurrentModule] = useState('home');

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentModule('home');
  };

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f7fa' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px 20px',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)'
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>Powerflow</h1>
          <p style={{ fontSize: '12px', opacity: '0.9', margin: '0' }}>Admin Dashboard</p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '11px', opacity: '0.8', textTransform: 'uppercase', marginBottom: '15px' }}>Modules</p>
          {[
            { id: 'home', label: '🏠 Dashboard', icon: 'home' },
            { id: 'disconnection', label: '⚡ Disconnection', icon: 'disconnect' },
            { id: 'reconnection', label: '↺ Reconnection', icon: 'reconnect' },
            { id: 'dtr', label: '📡 DTR Management', icon: 'dtr' },
            { id: 'nsc', label: '📋 NSC Inspection', icon: 'nsc' },
            { id: 'admin', label: '⚙ Admin Panel', icon: 'admin' }
          ].map(mod => (
            <button
              key={mod.id}
              onClick={() => setCurrentModule(mod.id)}
              style={{
                width: '100%',
                padding: '12px 15px',
                background: currentModule === mod.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: 'none',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                fontWeight: currentModule === mod.id ? '600' : '500'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
              onMouseOut={(e) => e.target.style.background = currentModule === mod.id ? 'rgba(255,255,255,0.2)' : 'transparent'}
            >
              {mod.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px 15px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            marginTop: '30px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
            e.target.style.borderColor = 'rgba(255,255,255,0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
            e.target.style.borderColor = 'rgba(255,255,255,0.3)';
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {currentModule === 'home' && <DashboardHome onSelectModule={setCurrentModule} />}
        {currentModule === 'disconnection' && <DisconnectionModule />}
        {currentModule === 'reconnection' && <div style={{ padding: '30px' }}><h2>Reconnection Module - Coming Soon</h2></div>}
        {currentModule === 'dtr' && <div style={{ padding: '30px' }}><h2>DTR Management - Coming Soon</h2></div>}
        {currentModule === 'nsc' && <div style={{ padding: '30px' }}><h2>NSC Inspection - Coming Soon</h2></div>}
        {currentModule === 'admin' && <AdminPanel />}
      </div>
    </div>
  );
}
