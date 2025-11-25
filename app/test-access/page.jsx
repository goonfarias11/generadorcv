export default function TestPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'system-ui, sans-serif',
      background: '#f5f5f5'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅ Acceso Público OK</h1>
      <p style={{ color: '#666' }}>Si ves esto, la ruta es accesible públicamente</p>
      <a 
        href="/builder" 
        style={{ 
          marginTop: '2rem', 
          padding: '1rem 2rem', 
          background: '#6366f1', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold'
        }}
      >
        Ir al Builder
      </a>
    </div>
  )
}
