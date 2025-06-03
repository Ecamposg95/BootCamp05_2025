/*
import React, { useState } from 'react';
import CameraFeed from './CameraFeed';

const LoginForm = () => {
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState('');

  const handleCapture = (imageData) => {
    setPhoto(imageData);
  };

  const handleLogin = () => {
    const allUsers = Object.keys(localStorage);
    let found = false;

    for (let user of allUsers) {
      const userData = JSON.parse(localStorage.getItem(user));
      if (userData.photo === photo) {
        found = true;
        setResult(`Bienvenido, ${userData.name}`);
        break;
      }
    }

    if (!found) {
      setResult('Usuario no reconocido');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Iniciar Sesión</h2>
      <CameraFeed onCapture={setPhoto} />
      {photo && <img src={photo} alt="Captura" className="mt-2 rounded border" />}
      <button
        onClick={handleLogin}
        className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded"
      >
        Iniciar Sesión
      </button>
      {result && <p className="mt-3 text-center">{result}</p>}
    </div>
  );
};

export default LoginForm;*/
import React, { useState } from 'react';
import CameraFeed from './CameraFeed';
import '../App.css';

const LoginForm = () => {
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState('');

  const handleCapture = (imageData) => {
    setPhoto(imageData);
  };

  const handleLogin = () => {
    const allUsers = Object.keys(localStorage);
    let found = false;

    for (let user of allUsers) {
      const userData = JSON.parse(localStorage.getItem(user));
      if (userData.photo === photo) {
        found = true;
        setResult(`Bienvenido, ${userData.name}`);
        break;
      }
    }

    if (!found) {
      setResult('Usuario no reconocido');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Iniciar Sesión</h2>
      <CameraFeed onCapture={setPhoto} />
      {photo && <img src={photo} alt="Captura" className="preview" />}
      <button onClick={handleLogin} className="button">Iniciar Sesión</button>
      {result && <p className="result">{result}</p>}
    </div>
  );
};

export default LoginForm;

