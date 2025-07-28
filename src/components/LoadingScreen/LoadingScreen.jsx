// src/components/LoadingScreen/LoadingScreen.jsx
import React, { useState, useEffect } from 'react';
import './LoadingScreen.css'; // Stil dosyamızı ekleyeceğiz

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 20000; // 5 saniye - Burası hala 5000 ms (5 saniye)
    const intervalTime = 50; // Her 50 ms'de bir güncelle

    const increment = (100 * intervalTime) / duration; // Her adımda ne kadar ilerleyecek

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + increment;
        if (newProgress >= 100) {
          clearInterval(interval);
          onLoadingComplete(); // Yükleme tamamlandığında çağrılacak fonksiyon
          return 100;
        }
        return newProgress;
      });
    }, intervalTime);

    // Bileşen kapatıldığında interval'ı temizle
    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen-overlay">
      {/* Arka plan görseli burada */}
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