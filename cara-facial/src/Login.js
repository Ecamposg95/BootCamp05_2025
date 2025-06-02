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
        setStatus('Error: ' + error.message);
      }
    };

    start();
  }, []);

  const drawFaceBoxes = (ctx, predictions) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
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
    if (!model || !videoRef.current) {
      setStatus('Modelo o cámara no disponibles.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const predictions = await model.estimateFaces(video, false);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (predictions.length === 0) {
      setStatus('❌ No se detectó ningún rostro.');
      return;
    }

    drawFaceBoxes(ctx, predictions);

    const capturedImage = canvas.toDataURL('image/jpeg');
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const match = storedUsers.find(user => user.image === capturedImage);

    if (match) {
      setStatus(`✅ Bienvenido, ${match.name}`);
    } else {
      setStatus('❌ Usuario no reconocido.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#1f2937' }}>Login Facial</h2>

      <div style={{ position: 'relative', display: 'inline-block', border: '1px solid #ccc', borderRadius: 8 }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: 480, borderRadius: 8 }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleLogin} style={buttonStyle}>
          Iniciar Login Facial
        </button>
        <p style={{ marginTop: 10, color: '#1f2937' }}>{status}</p>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default Login;
