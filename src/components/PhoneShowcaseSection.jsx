// DOSYA ADI: src/components/PhoneShowcaseSection.jsx
// Sol ve Sağ sütunların yeri değiştirildi.

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { phoneSlides } from '../data/phoneShowcaseData';
import './PhoneShowcaseSection.css';

export default function PhoneShowcaseSection() {
  const sectionRef = useRef(null);
  const slideCount = phoneSlides.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const contentTranslateY = useTransform(scrollYProgress, [0, 1], ["0%", `-${100 * (slideCount - 1)}%`]);

  return (
    <section ref={sectionRef} className="phone-section">
      <div className="sticky-container">
        
        <motion.div className="backgrounds-container" style={{ y: contentTranslateY }}>
          {phoneSlides.map(slide => (
            <div key={slide.id} className="background-slide" style={{ backgroundImage: `url(${slide.bgImage})` }} />
          ))}
        </motion.div>

        <div className="foreground-container">

          {/* --- DEĞİŞİKLİK: TELEFON ARTIK SOLDA --- */}
          <div className="visuals-column">
            <div className="frameless-phone">
              <motion.div className="screenshots-filmstrip" style={{ y: contentTranslateY }}>
                {phoneSlides.map(slide => (
                  <img key={slide.id} src={slide.screenImage} alt="" className="screenshot-image" />
                ))}
              </motion.div>
            </div>
          </div>

          {/* --- DEĞİŞİKLİK: METİNLER ARTIK SAĞDA --- */}
          <div className="showcase-content-column">
            <motion.div className="content-filmstrip" style={{ y: contentTranslateY }}>
              {phoneSlides.map((slide) => (
                <div key={slide.id} className="showcase-content-block">
                  <h2 className="showcase-title">{slide.title}</h2>
                  <h3 className="showcase-subtitle">{slide.subtitle}</h3>
                  <p className="showcase-description">{slide.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}