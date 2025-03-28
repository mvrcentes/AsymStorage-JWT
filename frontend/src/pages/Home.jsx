import React, { useState } from 'react';
import './styles.css';

const Home = () => {
  const [files, setFiles] = useState([]);
  const [verifyFile, setVerifyFile] = useState(null);

  // Función para manejar la carga de archivos
  const handleFileUpload = (event) => {
    const uploadedFiles = event.target.files;
    const fileArray = Array.from(uploadedFiles);
    setFiles(fileArray);
  };

  // Función para manejar la carga de archivo de verificación
  const handleFileVerify = (event) => {
    const file = event.target.files[0];
    setVerifyFile(file);
    alert('Archivo para verificar cargado');
  };

  return (
    <div className="container">
      <header>
        <h1>Welcome {`{user}`}</h1>
        <button className="create-keys-btn">Create keys</button>
      </header>

      <div className="upload-section">
        <h2>Cargar archivo</h2>
        <input type="file" onChange={handleFileUpload} multiple />
      </div>

      <div className="file-list">
        <h3>Archivos</h3>
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              {file.name} 
              <a href="#" className="download-link">Download</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="verify-section">
        <h2>Verificar Archivo</h2>
        <input type="file" onChange={handleFileVerify} />
      </div>
    </div>
  );
};

export default Home;