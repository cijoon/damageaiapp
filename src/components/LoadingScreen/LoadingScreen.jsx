// src/components/LoadingScreen/LoadingScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import './LoadingScreen.css';

// progress prop'unu ekledik
const LoadingScreen = ({ onLoadingComplete, progress }) => {
  // progress artık dışarıdan geliyor, kendi iç state'i değil
  // const [progress, setProgress] = useState(0); // Bu satırı kaldır

  useEffect(() => {
    // Burada artık kendi zamanlayıcımız yok, progress dışarıdan geliyor.
    // Dışarıdan gelen progress %100 olduğunda onLoadingComplete çağrılacak.
    if (progress >= 100) {
      onLoadingComplete();
    }
  }, [progress, onLoadingComplete]); // progress değiştikçe useEffect tetiklensin

  return (
    <div className="loading-screen-overlay">
      <img src="/loading.webp" alt="Loading Background" className="loading-background-image" />

      <div className="loading-content">
        <h2>Loading...</h2>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{Math.floor(progress)}%</p>
      </div>
    </div>
  );
};

export default LoadingScreen;