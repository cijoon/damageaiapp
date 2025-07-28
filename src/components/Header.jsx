// DOSYA ADI: src/components/Header.jsx
// Logo, JPEG'den SVG'ye güncellendi.

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Header.css';

export default function Header() {
  const { scrollY } = useScroll();
  // Sayfa 300px kaydırıldığında başlık ve küçük logo yavaşça görünsün
  const opacity = useTransform(scrollY, [0, 300], [0, 1]);

  return (
    <motion.header className="main-header" style={{ opacity }}>
      <div className="header-content">
        <div className="header-left">
          <span className="header-brand-name">DAMAGE AI</span>
        </div>
        <div className="header-center">
          {/* --- DEĞİŞİKLİK BURADA --- */}
          {/* Dosya yolu .jpg'den .svg'ye değiştirildi */}
          <img src="/images/BERILL.png" alt="Damage AI Logo" className="header-logo" />
        </div>
        <div className="header-right">
          <div className="store-buttons-container">
            <a href="https://apps.apple.com/tr/app/damage-ai-repair-assistant/id6746446379?l=tr" className="store-button" target="_blank" rel="noopener noreferrer">
              <img src="/images/app-store.svg" alt="App Store" />
              <span>App Store</span>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.zanugbisr.damagedetector" className="store-button" target="_blank" rel="noopener noreferrer">
              <img src="/images/play-store.svg" alt="Play Store" />
              <span>Play Store</span>
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}