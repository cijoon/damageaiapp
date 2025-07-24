// DOSYA ADI: src/components/IntroSection.jsx
// Ortadaki logo kaldırıldı ve video kontrolleri eklendi.

import React, { useState, useRef } from 'react';
import './IntroSection.css';

export default function IntroSection() {
  const videoRef = useRef(null); // Videoya doğrudan erişim için ref
  const [isPlaying, setIsPlaying] = useState(true); // Video oynuyor mu? (Başlangıçta evet)
  const [isMuted, setIsMuted] = useState(true); // Video sessiz mi? (Başlangıçta evet)

  // Oynatma/Durdurma fonksiyonu
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Ses Açma/Kapatma fonksiyonu
  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Kullanıcı introda scroll yaparsa bir sonraki bölüme geç
  const sectionRef = useRef(null);
  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let scrolled = false;
    const handleWheel = (e) => {
      if (!scrolled && e.deltaY > 0) {
        scrolled = true;
        // Bir sonraki section'ı bul
        const nextSection = section.nextElementSibling;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(() => { scrolled = false; }, 1500); // Spam engeli
      }
    };
    section.addEventListener('wheel', handleWheel, { passive: false });
    return () => section.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section id="intro" className="intro-section" ref={sectionRef}>
      <video
        ref={videoRef} // ref'i videoya bağlıyoruz
        className="background-video"
        src="/videos/intro-video.mp4"
        autoPlay
        loop
        muted // `muted` prop'u, otomatik oynatmanın garantisi için kalmalı
        playsInline
      />

      <div className="intro-overlay">
        {/* --- YENİ VİDEO KONTROLLERİ --- */}
        <div className="video-controls">
          <button onClick={handlePlayPause} className="control-button">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleMuteToggle} className="control-button">
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </div>
    </section>
  );
}