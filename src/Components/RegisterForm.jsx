/*src/components/RegisterForm.jsx
import React, { useState } from 'react';
import CameraFeed from './CameraFeed';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleCapture = (imageData) => {
    setPhoto(imageData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !photo) {
      alert('Por favor ingresa un nombre y toma una foto');
      return;
    }

    const userData = { name, photo };

    // Guardar localmente
    localStorage.setItem(name, JSON.stringify(userData));

    alert('Usuario registrado correctamente');
    setName('');
    setPhoto(null);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Registro</h2>
      <input
        className="w-full p-2 mb-2 border rounded"
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <CameraFeed onCapture={handleCapture} />
      {photo && <img src={photo} alt="Captura" className="mt-2 rounded border" />}
      <button
        type="submit"
        className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded"
      >
        Registrar
      </button>
    </form>
  );
};

export default RegisterForm;
}*/
// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import CameraFeed from './CameraFeed';
import './RegisterForm.css'; // Asegúrate de tener este import

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleCapture = (imageData) => {
    setPhoto(imageData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !photo) {
      alert('Por favor ingresa un nombre y captura la imagen');
      return;
    }

    const userData = { name, photo };
    localStorage.setItem(name, JSON.stringify(userData));

    alert('Usuario registrado correctamente');
    setName('');
    setPhoto(null);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Registrarse</h2>
      <input
        className="form-input"
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <CameraFeed onCapture={handleCapture} />
      {photo && <img src={photo} alt="Captura" className="photo-preview" />}
      <button type="submit" className="form-button">
        Registrar
      </button>
    </form>
  );
};

export default RegisterForm;

