import React, { useState } from 'react';
import Camera from '/Camera.js';

function App() {
  const [mode, setMode] = useState('login');

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Face ID Login</h1>
      <button onClick={() => setMode('register')}>Registro</button>
      <button onClick={() => setMode('login')}>Login</button>
      <Camera mode={mode} />
    </div>
  );
}

export default App;
