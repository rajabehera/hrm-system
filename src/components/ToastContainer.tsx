// src/components/ToastContainer.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectAllToasts, removeToast } from '../features/toast/toastSlice';
import { ToastType } from '../features/toast/toastTypes';

const ToastContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectAllToasts);

  useEffect(() => {
    toasts.forEach(toast => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration || 3000);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  return (
    <div style={containerStyle}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            ...toastStyle,
            ...getToastTypeStyle(toast.type)
          }}
          onClick={() => dispatch(removeToast(toast.id))}
        >
          <span style={{ marginRight: '10px', fontSize: '18px' }}>
            {getIcon(toast.type)}
          </span>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(removeToast(toast.id));
            }}
            style={closeButtonStyle}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

const getIcon = (type: ToastType): string => {
  switch (type) {
    case ToastType.SUCCESS: return '✅';
    case ToastType.ERROR: return '❌';
    case ToastType.INFO: return 'ℹ️';
    case ToastType.WARNING: return '⚠️';
    default: return 'ℹ️';
  }
};

const getToastTypeStyle = (type: ToastType): React.CSSProperties => {
  switch (type) {
    case ToastType.SUCCESS:
      return { backgroundColor: '#4CAF50', color: 'white' };
    case ToastType.ERROR:
      return { backgroundColor: '#f44336', color: 'white' };
    case ToastType.INFO:
      return { backgroundColor: '#2196F3', color: 'white' };
    case ToastType.WARNING:
      return { backgroundColor: '#FF9800', color: 'white' };
    default:
      return { backgroundColor: '#333', color: 'white' };
  }
};

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '400px'
};

const toastStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  animation: 'slideIn 0.3s ease-out',
  minWidth: '300px'
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: '18px',
  padding: '0 0 0 10px',
  opacity: 0.8
};

export default ToastContainer;