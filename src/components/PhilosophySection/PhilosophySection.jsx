import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './PhilosophySection.css';

export default function PhilosophySection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const weTranslateY = useTransform(scrollYProgress, [0, 1], ["-250%", "350%"]);

  return (
    <section ref={sectionRef} className="philosophy-section">
      <div className="try-free-container">
        <img 
          src="/tryfree.svg" 
          alt="Try Free" 
          className="try-free-svg" 
        />
        <p className="try-free-text">Scan & Free Trial</p>
      </div>
     
      {/* --- SINIF İSİMLERİ ÇAKIŞMAYI ÖNLEMEK İÇİN DEĞİŞTİRİLDİ --- */}
      <div className="philosophy-store-container">
        <div className="philosophy-store-wrapper">
          <a href="https://apps.apple.com/app/damage-ai-repair-assistant/id6746446379" target="_blank" rel="noopener noreferrer">
            <img src="/images/app-store.svg" alt="Download on the App Store" className="philosophy-store-img" />
          </a>
          <div className="philosophy-store-label">App Store</div>
        </div>
        <div className="philosophy-store-wrapper">
          <a href="https://play.google.com/store/apps/details?id=com.zanugbisr.damagedetector" target="_blank" rel="noopener noreferrer">
            <img src="/images/play-store.svg" alt="Get it on Google Play" className="philosophy-store-img" />
          </a>
          <div className="philosophy-store-label">Play Store</div>
        </div>
      </div>
      
      <div className="heading-container">
        <h2 className="main-heading">
          Boost Your Shop with
          <br />
                   Be Found First with
          <br />
                Find Customer with
          <br />
         Earn more with
        </h2>
        <motion.h2 
          className="we-word-overlay"
          style={{ y: weTranslateY }}
        >
          ai
        </motion.h2>
      </div>

      <div className="body-container">
        <h3 className="philosophy-title">Philosophy</h3>
        <p className="philosophy-text">
          At Damage AI, we have combined the disciplines of design, engineering, project management and construction as well as our experience and client portfolio in order to gain a more competitive position in the market while serving a broader client profile. It is the utmost objective of DAMAGE AI to meet and exceed the require-ments of its clients without compromising our principles in order to achieve this objective.
        </p>
      </div>
    </section>
  );
}
