export const NotFound: React.FC = () => (
  <div style={errorContainerStyle}>
    <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
    <h2 style={{ margin: '10px 0' }}>Page Not Found</h2>
    <p style={{ color: '#666', marginBottom: '20px' }}>
      The page you're looking for doesn't exist.
    </p>
    <a href="/dashboard" style={linkButtonStyle}>
      🏠 Go to Dashboard
    </a>
  </div>
);

const linkButtonStyle: React.CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#2196F3',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: 'bold',
  display: 'inline-block'
};
const errorContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  textAlign: 'center'
};