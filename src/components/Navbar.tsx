// src/components/Navbar.tsx
import React from 'react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'employees', label: '👥 Employees', icon: '👥' },
    { id: 'departments', label: '🏢 Departments', icon: '🏢' },
    { id: 'leaves', label: '📅 Leaves', icon: '📅' },
  ];

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>
        <h2 style={{ margin: 0, color: 'white' }}>🏢 HRM System</h2>
      </div>
      
      <div style={menuStyle}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              ...menuItemStyle,
              ...(currentPage === item.id ? activeMenuItemStyle : {})
            }}
          >
            <span style={{ marginRight: '8px' }}>{item.icon}</span>
            {item.label.replace(/^.\s/, '')}
          </button>
        ))}
      </div>
    </nav>
  );
};

const navStyle: React.CSSProperties = {
  backgroundColor: '#2196F3',
  color: 'white',
  padding: '15px 30px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 100
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center'
};

const menuStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px'
};

const menuItemStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  cursor: 'pointer',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'background-color 0.2s',
  display: 'flex',
  alignItems: 'center'
};

const activeMenuItemStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.2)',
  fontWeight: 'bold'
};

export default Navbar;