// src/components/CameraFeed.jsx
import React, { useRef, useEffect } from 'react';

const CameraFeed = ({ onCapture }) => {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 440, 280);
    const imageData = canvasRef.current.toDataURL('image/jpeg');
    onCapture(imageData);
  };

  return (
    <div>
      <video ref={videoRef} width="440" height="280" autoPlay />
      <canvas ref={canvasRef} width="440" height="280" style={{ display: 'none' }} />
      <button onClick={capturePhoto} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Capturar rostro</button>
    </div>
  );
};

export default CameraFeed;
