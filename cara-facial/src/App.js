import React, { useState } from 'react';
import Registro from './Registro';
import Login from './Login';

function App() {
  const [view, setView] = useState('registro');

  return (
    <div>
      <nav style={{ padding: 10 }}>
        <button onClick={() => setView('registro')}>Registro</button>
        <button onClick={() => setView('login')}>Login</button>
      </nav>
      {view === 'registro' ? <Registro /> : <Login />}
    </div>
  );
}

export default App;
