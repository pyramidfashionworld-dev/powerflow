import React from 'react';

export default function DashboardHome({ onSelectModule }) {
  const modules = [
    {
      id: 'disconnection',
      title: 'Disconnection Management',
      icon: '⚡',
      count: '2,272',
      description: 'Manage disconnected consumers and reconnection requests',
      color: '#ef5350'
    },
    {
      id: 'reconnection',
      title: 'Reconnection',
      icon: '↺',
      count: '847',
      description: 'Process reconnection applications and status updates',
      color: '#10b981'
    },
    {
      id: 'dtr',
      title: 'DTR Management',
      icon: '📡',
      count: '1,234',
      description: 'Monitor and manage distribution transformers',
      color: '#3b82f6'
    },
    {
      id: 'nsc',
      title: 'NSC Inspection',
      icon: '📋',
      count: '456',
      description: 'New service connection applications',
      color: '#f59e0b'
    },
    {
      id: 'admin',
      title: 'Admin Panel',
      icon: '⚙',
      count: '12',
      description: 'System settings and user management',
      color: '#8b5cf6'
    },
    {
      id: 'reconnection',
      title: 'Reports',
      icon: '📊',
      count: '28',
      description: 'Generate and view system reports',
      color: '#ec4899'
    }
  ];

  return (
    <div style={{ padding: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          margin: '0 0 10px 0',
          color: '#1a202c'
        }}>
          🏠 Dashboard
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          margin: '0'
        }}>
          Welcome to Powerflow Admin Control Center. Select a module to get started.
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
          { label: 'Total Disconnected', value: '2,272', color: '#ef5350' },
          { label: 'Pending Reconnection', value: '847', color: '#10b981' },
          { label: 'Active Transformers', value: '1,234', color: '#3b82f6' },
          { label: 'Revenue (Monthly)', value: '₹69.1K', color: '#f59e0b' }
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

      {/* Modules Grid */}
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        margin: '0 0 20px 0',
        color: '#1a202c'
      }}>
        Available Modules
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {modules.map(module => (
          <div
            key={module.id}
            onClick={() => onSelectModule(module.id)}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderTop: `4px solid ${module.color}`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Background Icon */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              fontSize: '100px',
              opacity: '0.1',
              pointerEvents: 'none'
            }}>
              {module.icon}
            </div>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: '36px',
                marginBottom: '12px'
              }}>
                {module.icon}
              </div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: '#1a202c'
              }}>
                {module.title}
              </h3>

              <p style={{
                fontSize: '13px',
                color: '#718096',
                margin: '0 0 16px 0',
                lineHeight: '1.6'
              }}>
                {module.description}
              </p>

              <div style={{
                background: `${module.color}15`,
                color: module.color,
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'inline-block'
              }}>
                {module.count} items
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: module.color,
                fontSize: '14px',
                fontWeight: '600',
                marginTop: '12px'
              }}>
                Access Module
                <span style={{ fontSize: '16px' }}>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
