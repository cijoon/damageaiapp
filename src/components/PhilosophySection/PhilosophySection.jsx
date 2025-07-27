import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './PhilosophySection.css';

export default function PhilosophySection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // DEĞİŞİKLİK 1: "we" kelimesinin hareket hızı artırıldı.
  // Hareket aralığı genişletildi, bu da aynı scroll mesafesinde daha hızlı hareket etmesini sağlar.
  const weTranslateY = useTransform(scrollYProgress, [0, 1], ["-250%", "350%"]);

  return (
    <section ref={sectionRef} className="philosophy-section">
      <div className="heading-container">
        <h2 className="main-heading">
          {/* DEĞİŞİKLİK 2: "we" kelimesi metin akışından çıkarıldı */}
          stay curious, always with
          <br />
                   collaborate with
          <br />
                nurture talent with
          <br />
         design for the future with
        </h2>
        {/* "we" kelimesi artık burada, diğerlerinden bağımsız olarak konumlanacak */}
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
