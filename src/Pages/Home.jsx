// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <h1 className="text-3xl font-bold">Sistema de Reconocimiento Facial</h1>
    <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded">
      Registrar Usuario
    </Link>
    <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
      Iniciar Sesión
    </Link>
  </div>
);

export default Home;
