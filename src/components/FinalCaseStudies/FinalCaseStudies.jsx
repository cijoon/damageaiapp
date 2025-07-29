// DOSYA ADI: src/components/FinalCaseStudies/FinalCaseStudies.jsx
// Animasyon zamanlaması düzeltildi ve scroll ile bir sonraki bölüme geçiş özelliği eklendi.

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
  
  const numSlides = slides.length;

  // *** DEĞİŞİKLİK 1: Animasyon zamanlaması düzeltildi ***
  // Animasyonların kaydırma alanının sonuna kadar sürmesi için (N-1)'e bölüyoruz.
  const partDuration = 1 / (numSlides - 1);

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

  // *** DEĞİŞİKLİK 2: Scroll ile sonraki bölüme geçiş özelliği eklendi ***
  const isScrollingDownRef = useRef(false); // Spam engellemek için

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event) => {
      // Animasyonun tamamlandığını (progress >= 1) ve aşağı scroll edildiğini kontrol et
      if (mainScrollProgress.get() >= 1 && event.deltaY > 0 && !isScrollingDownRef.current) {
        isScrollingDownRef.current = true;
        
        // Bir sonraki bölümü bul ve ona smooth scroll yap
        const nextSection = container.nextElementSibling;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Bir sonraki scroll işlemi için 1.5 saniye bekle
        setTimeout(() => {
          isScrollingDownRef.current = false;
        }, 1500);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [mainScrollProgress]); // mainScrollProgress'i bağımlılığa ekliyoruz


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
            let y;
            if (index === 0) {
              y = useTransform(mainScrollProgress, [0, partDuration], ["0%", "-100%"]);
            } else if (index === numSlides - 1) {
              const start = (index - 1) * partDuration;
              const end = index * partDuration;
              y = useTransform(mainScrollProgress, [start, end], ["100%", "0%"]);
            } else {
              const start = (index - 1) * partDuration;
              const end = index * partDuration;
              const exitEnd = (index + 1) * partDuration;
              y = useTransform(mainScrollProgress, [start, end, exitEnd], ["100%", "0%", "-100%"]);
            }
            return (
              <motion.div key={slide.id} className="content-block" style={{ y, zIndex: numSlides - index }}>
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}