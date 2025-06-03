/*
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

export default RegisterForm;*/

import React, { useState } from 'react';
import CameraFeed from './CameraFeed';
import '../App.css';


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
    <form onSubmit={handleSubmit} className="container">
      <h2 className="title">Registro</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <CameraFeed onCapture={handleCapture} />
      {photo && <img src={photo} alt="Captura" className="preview" />}
      <button type="submit" className="button">Registrar</button>
    </form>
  );
};

export default RegisterForm;



