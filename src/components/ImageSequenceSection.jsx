// DOSYA ADI: src/components/ImageSequenceSection.jsx

import React, { useRef, useEffect } from 'react';
import './ImageSequenceSection.css';

export default function ImageSequenceSection({ images }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIndexRef = useRef(0);

  const totalFrames = images.length;

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

  // Scroll dinleyicisi ile kare geçişi
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || images.length < totalFrames) return;

    const handleWheel = (event) => {
      let currentFrame = frameIndexRef.current;

      if (event.deltaY > 0 && currentFrame < totalFrames - 1) {
        event.preventDefault();
        currentFrame++;
      } else if (event.deltaY < 0 && currentFrame > 0) {
        event.preventDefault();
        currentFrame--;
      }

      frameIndexRef.current = currentFrame;
      drawFrame(currentFrame);
    };

    section.addEventListener('wheel', handleWheel, { passive: false });
    return () => section.removeEventListener('wheel', handleWheel);
  }, [images]);

  // Tüm resimler yüklendiyse canvas'ı göster
  return (
    <section ref={sectionRef} className="sequence-section-locked">
      <canvas ref={canvasRef} width="1920" height="1080"></canvas>
    </section>
  );
}
