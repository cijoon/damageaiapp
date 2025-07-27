// DOSYA ADI: src/components/FinalCaseStudies/FinalCaseStudies.jsx
// Sol sütun, sağ ile senkronize çalışan ayrı bloklar olarak yeniden düzenlendi.

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { slides } from '../../data/caseStudies';
import './FinalCaseStudies.css';
import { useDevice } from "../../contexts/DeviceContext";

export default function FinalCaseStudies() {
  const { isMobile } = useDevice();
  const containerRef = useRef(null);
  const firstImageTriggerRef = useRef(null);

  const { scrollYProgress: mainScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: firstImageEnterProgress } = useScroll({
    target: firstImageTriggerRef,
    offset: ["start end", "end start"],
  });

  // --- BU SATIRI SİLİYORUZ, ARTIK GEREKLİ DEĞİL ---
  // const contentTranslateY = useTransform(mainScrollProgress, [0, 1], ["0%", "-66.66%"]);
  
  const partDuration = 1 / slides.length;

  useEffect(() => {
    const blocks = document.querySelectorAll('.content-block');
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fc-animate');
        }
      });
    }, { threshold: 0.3 });
    blocks.forEach(block => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  // DOSYA ADI: src/components/FinalCaseStudies/FinalCaseStudies.jsx
// Sadece `.content-column` içindeki map döngüsünü güncelleyin.

// ... dosyanın üst kısımları aynı ...

  if (isMobile) {
    return (
      <section className="fc-mobile-container">
        {slides.map((slide) => (
          <div key={slide.id} className="fc-mobile-block">
            <img src={slide.hero} alt={slide.heading} className="fc-mobile-hero" />
            <div className="fc-mobile-content">
              <h2>{slide.heading}</h2>
              <small>{slide.sub}</small>
              <div className="thumb-row">
                <img src={slide.thumb1} alt="" className="thumb thumb-1" />
                <img src={slide.thumb2} alt="" className="thumb thumb-2" />
              </div>
              <p>{slide.body}</p>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section ref={containerRef} className="scroll-container">
      <div className="sticky-container">

        <div className="content-column">
          {slides.map((slide, index) => {
            // Her sol blok için kendi Y (dikey) pozisyonunu hesaplıyoruz
            let y; // Değişkeni burada tanımlıyoruz

            if (index === 0) {
              // BİRİNCİ BLOK: Sadece çıkış animasyonu yapar (Doğru, dokunmuyoruz).
              y = useTransform(mainScrollProgress, [0, partDuration], ["0%", "-100%"]);
            } else if (index === slides.length - 1) {
              // --- YENİ KURAL: EĞER SON BLOK İSE ---
              // Sadece giriş animasyonu yapar ve ekranda kalır. Çıkış animasyonu olmaz.
              const start = (index - 1) * partDuration;
              const end = index * partDuration;
              y = useTransform(mainScrollProgress, [start, end], ["100%", "0%"]);
            } else {
              // ORTADAKİ BLOK(LAR): Hem giriş hem çıkış animasyonu yapar (Doğru, dokunmuyoruz).
              const start = (index - 1) * partDuration;
              const end = index * partDuration;
              const exitEnd = (index + 1) * partDuration;
              y = useTransform(mainScrollProgress, [start, end, exitEnd], ["100%", "0%", "-100%"]);
            }

            return (
              <motion.div key={slide.id} className="content-block" style={{ y, zIndex: slides.length - index }}>
                <h2>{slide.heading}</h2>
                <small>{slide.sub}</small>
                <div className="thumb-row">
                  <img src={slide.thumb1} alt="" className="thumb thumb-1" />
                  <img src={slide.thumb2} alt="" className="thumb thumb-2" />
                </div>
                <p>{slide.body}</p>
              </motion.div>
            );
          })}
        </div>
       
        {/* --- SOL SÜTUN DEĞİŞİKLİĞİ BİTİŞ --- */}


        {/* --- SAĞ SÜTUN (DEĞİŞİKLİK YOK, AYNI KALIYOR) --- */}
        <div className="visuals-parent">
          <div ref={firstImageTriggerRef} className="first-image-trigger"></div>
          {slides.map((slide, index) => {
            if (index === 0) {
              const scale = useTransform(firstImageEnterProgress, [0, 1], [1.8, 1]);
              return (
                <motion.div key={slide.id} className="visual-block" style={{ zIndex: 1 }}>
                  <motion.div className="image-zoom-wrapper" style={{ scale }}>
                    <img src={slide.hero} alt={slide.heading} />
                  </motion.div>
                  {/* View Article butonu kaldırıldı */}
                </motion.div>
              );
            }
            const start = (index - 1) * partDuration;
            const end = index * partDuration;
            const y = useTransform(mainScrollProgress, [start, end], ["101%", "0%"]);
            const scale = useTransform(mainScrollProgress, [start, end], [1.8, 1]);
            return (
              <motion.div key={slide.id} className="visual-block" style={{ y, zIndex: index + 1 }}>
                <motion.div className="image-zoom-wrapper" style={{ scale }}>
                  <img src={slide.hero} alt={slide.heading} />
                </motion.div>
                {/* View Article butonu kaldırıldı */}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}