import React, { useState } from 'react';
import Registro from './Registro';
import Login from './Login';

function App() {
  const [view, setView] = useState('registro');

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <nav style={{ padding: 20, textAlign: 'center', backgroundColor: '#1f2937' }}>
        <button
          onClick={() => setView('registro')}
          style={navButtonStyle(view === 'registro')}
        >
          Registro
        </button>
        <button
          onClick={() => setView('login')}
          style={navButtonStyle(view === 'login')}
        >
          Login
        </button>
      </nav>
      <div style={{ padding: 20 }}>
        {view === 'registro' ? <Registro /> : <Login />}
      </div>
    </div>
  );
}

const navButtonStyle = (active) => ({
  margin: '0 10px',
  padding: '10px 20px',
  backgroundColor: active ? '#3b82f6' : '#e5e7eb',
  color: active ? 'white' : '#1f2937',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  fontWeight: 'bold',
});

export default App;
