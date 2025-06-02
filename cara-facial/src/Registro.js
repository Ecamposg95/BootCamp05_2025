import React, { useRef, useEffect, useState } from 'react';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs';

function Registro() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [faceModel, setFaceModel] = useState(null);

  useEffect(() => {
    async function setupCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }

    async function loadModelAndStart() {
      const model = await blazeface.load();
      setFaceModel(model);

      setInterval(async () => {
        if (
          videoRef.current &&
          canvasRef.current &&
          videoRef.current.readyState === 4
        ) {
          const predictions = await model.estimateFaces(videoRef.current, false);
          const ctx = canvasRef.current.getContext('2d');
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          predictions.forEach(pred => {
            const [x, y, width, height] = [
              pred.topLeft[0],
              pred.topLeft[1],
              pred.bottomRight[0] - pred.topLeft[0],
              pred.bottomRight[1] - pred.topLeft[1],
            ];
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
          });
        }
      }, 100);
    }

    setupCamera();
    loadModelAndStart();
  }, []);

  const handleRegister = () => {
    if (!name) {
      setMessage('Por favor, escribe tu nombre antes de registrar.');
      return;
    }

    const canvas = document.createElement('canvas');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL('image/jpeg');

    const stored = JSON.parse(localStorage.getItem('users') || '[]');
    stored.push({ name, image: imageUrl });
    localStorage.setItem('users', JSON.stringify(stored));

    setMessage(`¡${name} registrado con éxito!`);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#1f2937' }}>Registro Facial</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={handleRegister}
          style={buttonStyle}
        >
          Registrar rostro
        </button>
      </div>

      <div style={{ position: 'relative', display: 'inline-block', border: '1px solid #ccc', borderRadius: 8 }}>
        <video ref={videoRef} autoPlay muted playsInline style={{ width: 480, borderRadius: 8 }} />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      </div>

      {message && <p style={{ color: '#2563eb', marginTop: 20 }}>{message}</p>}
    </div>
  );
}

const inputStyle = {
  padding: 10,
  fontSize: 16,
  border: '1px solid #ccc',
  borderRadius: 5,
  width: 200,
};

const buttonStyle = {
  marginLeft: 10,
  padding: '10px 20px',
  fontSize: 16,
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
};

export default Registro;
