// DOSYA ADI: src/components/ImageSequenceSection.jsx
// Scroll'u ele geçirerek tam kontrol sağlayan nihai versiyon.

import React, { useRef, useState, useEffect } from 'react';
import './ImageSequenceSection.css';

const totalFrames = 135;
const imagePath = (frame) => `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}.jpg`;

export default function ImageSequenceSection() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [framesLoaded, setFramesLoaded] = useState(0);
  
  // Animasyonun o anki karesini bir ref içinde tutacağız.
  const frameIndexRef = useRef(0);

  // Resimleri önceden yükleme (Bu kısım doğruydu)
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = [];
      for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.src = imagePath(i);
        await img.decode();
        loadedImages.push(img);
        setFramesLoaded(prev => prev + 1);
      }
      setImages(loadedImages);
    };
    loadImages();
  }, []);

  // Canvas'a belirli bir kareyi çizen yardımcı fonksiyon
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const img = images[index];
    if (canvas && context && img) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  // Resimler yüklendikten sonra ilk kareyi çiz
  useEffect(() => {
    if (images.length === totalFrames) {
      drawFrame(0);
    }
  }, [images]);

  // --- ANİMASYONUN YENİ KALBİ: MOUSE TEKERLEĞİ DİNLEYİCİSİ ---
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || images.length < totalFrames) return;

    const handleWheel = (event) => {
      // O anki frame'i al
      let currentFrame = frameIndexRef.current;

      // Scroll yönüne göre frame'i artır veya azalt
      if (event.deltaY > 0) { // Aşağı scroll
        if (currentFrame < totalFrames - 1) {
          event.preventDefault(); // Sayfanın normal kaymasını ENGELLE
          currentFrame++;
        }
      } else { // Yukarı scroll
        if (currentFrame > 0) {
          event.preventDefault(); // Sayfanın normal kaymasını ENGELLE
          currentFrame--;
        }
      }
      
      // Yeni frame'i ref'e kaydet ve canvas'a çiz
      frameIndexRef.current = currentFrame;
      drawFrame(currentFrame);
    };
    
    // Event listener'ı ekle
    section.addEventListener('wheel', handleWheel, { passive: false });
    // Bileşen kaldırıldığında listener'ı temizle
    return () => section.removeEventListener('wheel', handleWheel);

  }, [images]); // Sadece resimler yüklendiğinde çalışır

  // Yükleme ekranı
  if (images.length < totalFrames) {
    return (
      <div className="loading-screen">
        Yükleniyor: {Math.round((framesLoaded / totalFrames) * 100)}%
      </div>
    );
  }

  return (
    // Bu bölüm artık 100vh yüksekliğinde ve scroll'u kendi içinde yönetiyor
    <section ref={sectionRef} className="sequence-section-locked">
      <canvas ref={canvasRef} width="1920" height="1080"></canvas>
    </section>
  );
}