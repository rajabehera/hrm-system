// src/components/LoadingSkeleton.tsx

export const LoadingSkeleton: React.FC = () => (
  <div style={{ padding: '20px' }}>
    {[1, 2, 3].map(i => (
      <div key={i} style={skeletonCardStyle}>
        <div style={{ ...skeletonLineStyle, width: '60%' }} />
        <div style={{ ...skeletonLineStyle, width: '80%' }} />
        <div style={{ ...skeletonLineStyle, width: '40%' }} />
      </div>
    ))}
  </div>
);

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div style={spinnerContainerStyle}>
    <div style={spinnerStyle} />
    <p style={{ marginTop: '15px', color: '#666' }}>{message}</p>
  </div>
);

const skeletonCardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  marginBottom: '15px',
  borderRadius: '8px',
  animation: 'pulse 1.5s ease-in-out infinite'
};

const skeletonLineStyle: React.CSSProperties = {
  height: '16px',
  backgroundColor: '#e0e0e0',
  borderRadius: '4px',
  marginBottom: '10px'
};

const spinnerContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px'
};

const spinnerStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  border: '5px solid #f3f3f3',
  borderTop: '5px solid #2196F3',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};
