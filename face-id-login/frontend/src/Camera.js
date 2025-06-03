import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const Camera = ({ mode }) => {
  const webcamRef = useRef();

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const name = mode === "register" ? prompt("Tu nombre:") : undefined;

    try {
      const res = await axios.post(`http://127.0.0.1:5000/${mode}`, {
        name,
        photo: imageSrc
      });
      alert(res.data.message || `Bienvenido ${res.data.name}`);
    } catch (err) {
      alert(err.response?.data?.error || "Ocurrió un error.");
    }
  };

  return (
    <div>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>
        {mode === "register" ? "Registrar rostro" : "Iniciar sesión"}
      </button>
    </div>
  );
};

export default Camera;
