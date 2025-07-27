// DOSYA ADI: src/components/PhoneShowcaseSection.jsx
// Sol ve Sağ sütunların yeri değiştirildi.

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { phoneSlides } from '../data/phoneShowcaseData';
import './PhoneShowcaseSection.css';
import { useDevice } from "../contexts/DeviceContext";

export default function PhoneShowcaseSection() {
  const sectionRef = useRef(null);
  const slideCount = phoneSlides.length;
  const { isMobile } = useDevice();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const contentTranslateY = useTransform(scrollYProgress, [0, 1], ["0%", `-${100 * (slideCount - 1)}%`]);

  useEffect(() => {
    const blocks = document.querySelectorAll('.showcase-content-block');
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ps-animate');
        }
      });
    }, { threshold: 0.3 });
    blocks.forEach(block => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  if (isMobile) {
    const hardcodedDescriptions = [
      `Fix it fast. Know your options.\nScan your issue. See nearby repairers or sellers. Get it done.\nFrom cracked walls to worn-out faucets, Damage AI instantly analyzes the problem and gives you cost estimates and smart suggestions — no rules broken.`,
      `Smarter than a search. Faster than a call.\nPowered by real-time visual detection and marketplace data.\nDon’t waste time browsing. Just scan a broken object or damaged wall — and let Damage AI show you the best fix and price in seconds.`,
      `Got damage? We've got answers.\nScan. Get options. Choose smart.\nWhether it’s a broken cabinet or a leaky pipe, just point your camera — Damage AI identifies the issue and tells you how to fix it, how much it’ll cost, and who can help.`
    ];
    return (
      <section className="phone-mobile-section">
        {phoneSlides.map((slide, idx) => (
          <React.Fragment key={slide.id}>
            <div className="phone-mobile-block">
              <div className="phone-mobile-mockup">
                <img src="/images/phone-mockup.png" alt="Phone Mockup" className="phone-mobile-mockup-img" />
                <img src={slide.screenImage} alt="Screenshot" className="phone-mobile-screenshot" />
              </div>
            </div>
            <div className="phone-mobile-content">
              {hardcodedDescriptions[idx].split('\n').map((line, i) => (
                <p key={i} className="showcase-description" style={{marginBottom: 8}}>{line}</p>
              ))}
            </div>
          </React.Fragment>
        ))}
      </section>
    );
  }

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