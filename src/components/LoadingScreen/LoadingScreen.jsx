// DOSYA ADI: src/components/LoadingScreen/LoadingScreen.jsx

import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="spinner"></div> {/* Basit bir dönen yükleme animasyonu */}
      <p>Loading...</p>
    </div>
  );
};

export default LoadingScreen;