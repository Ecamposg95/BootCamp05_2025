import React, { useRef, useEffect, useState } from 'react';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs';

function Login() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('Esperando cámara...');
  const [model, setModel] = useState(null);

  useEffect(() => {
    const start = async () => {
      try {
        setStatus('Cargando modelo...');
        const loadedModel = await blazeface.load();
        setModel(loadedModel);

        setStatus('Activando cámara...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setStatus('Cámara activa. Presiona "Iniciar Login Facial".');
      } catch (error) {
        setStatus('Error al iniciar cámara o modelo: ' + error.message);
      }
    };

    start();
  }, []);

  const drawFaceBoxes = (ctx, predictions) => {
    ctx.strokeStyle = 'gold';
    ctx.lineWidth = 3;
    predictions.forEach(pred => {
      const [x, y, width, height] = [
        pred.topLeft[0],
        pred.topLeft[1],
        pred.bottomRight[0] - pred.topLeft[0],
        pred.bottomRight[1] - pred.topLeft[1],
      ];
      ctx.strokeRect(x, y, width, height);
    });
  };

  const handleLogin = async () => {
    console.log('handleLogin called');
    console.log('canvasRef.current:', canvasRef.current);

    if (!model || !videoRef.current) {
      setStatus('Modelo o cámara no disponibles.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!canvas) {
      setStatus('Canvas no está listo.');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setStatus('No se pudo obtener contexto del canvas.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const predictions = await model.estimateFaces(video, false);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (predictions.length === 0) {
      setStatus('❌ No se detectó ningún rostro. Intenta de nuevo.');
      return;
    }

    drawFaceBoxes(ctx, predictions);

    const capturedImage = canvas.toDataURL('image/jpeg');
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const match = storedUsers.find(user => user.image === capturedImage);

    if (match) {
      setStatus(`✅ Bienvenido, ${match.name}!`);
    } else {
      setStatus('❌ Usuario no reconocido.');
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ border: '2px solid gold', display: 'block' }}
        width="480"
        height="360"
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
        width="480"
        height="360"
      />
      <button
        onClick={handleLogin}
        style={{
          marginTop: 10,
          padding: '10px 20px',
          backgroundColor: 'gold',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
          fontWeight: 'bold',
          color: '#000',
        }}
      >
        Iniciar Login Facial
      </button>
      <p style={{ marginTop: 10, fontWeight: 'bold' }}>{status}</p>
    </div>
  );
}

export default Login;
