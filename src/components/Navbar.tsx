// src/components/Navbar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, selectCurrentUser } from '../features/auth/authSlice';
import { showSuccessToast } from '../features/toast/toastSlice';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'employees', label: '👥 Employees', icon: '👥' },
    { id: 'departments', label: '🏢 Departments', icon: '🏢' },
    { id: 'leaves', label: '📅 Leaves', icon: '📅' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showSuccessToast('Logged out successfully'));
    navigate('/login');
  };

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

      {/* User Profile Section */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={profileButtonStyle}
        >
          <div style={avatarStyle}>
            {currentUser?.firstName[0]}{currentUser?.lastName[0]}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {currentUser?.firstName} {currentUser?.lastName}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {currentUser?.role}
            </div>
          </div>
          <span style={{ marginLeft: '8px' }}>▼</span>
        </button>

        {showProfileMenu && (
          <div style={dropdownStyle}>
            <div style={dropdownItemStyle}>
              <strong>Email:</strong> {currentUser?.email}
            </div>
            <div style={dropdownItemStyle}>
              <strong>Role:</strong> {currentUser?.role}
            </div>
            <div style={dividerStyle} />
            <button
              onClick={handleLogout}
              style={logoutButtonStyle}
            >
              🚪 Logout
            </button>
          </div>
        )}
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

const profileButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  border: 'none',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

const avatarStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#FF9800',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '14px'
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: '8px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  minWidth: '200px',
  overflow: 'hidden',
  zIndex: 1000
};

const dropdownItemStyle: React.CSSProperties = {
  padding: '12px 16px',
  color: '#333',
  fontSize: '14px',
  borderBottom: '1px solid #f0f0f0'
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#e0e0e0',
  margin: '4px 0'
};

const logoutButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#f44336',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold'
};

export default Navbar;