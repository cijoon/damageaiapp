// DOSYA ADI: src/components/CaseStudies/CaseStudiesSection.jsx

import React from 'react';
import { slides } from '../../data/caseStudies';
import useSlideScroll from './useSlideScroll';
import './CaseStudies.css'; // Stil dosyamız

export default function CaseStudiesSection() {
  const { triggerRefs, getSlideStyles } = useSlideScroll(slides.length);

  return (
    <section id="case-studies" className="case-wrapper">
      {/* Bu div, sayfa kaydırılırken ekrana yapışacak olan ana alandır */}
      <div className="sticky-container">
        <div className="slides-canvas">
          {slides.map((slide, index) => {
            const styles = getSlideStyles(index);
            return (
              <React.Fragment key={slide.id}>
                {/* Sol Sütun (Metinler) */}
                <article className="cs-text-column" style={styles.text}>
                  <h2>{slide.heading}</h2>
                  <small>{slide.sub}</small>
                  <div className="thumb-row">
                    <img src={slide.thumb1} alt="" className="thumb thumb-1" />
                    <img src={slide.thumb2} alt="" className="thumb thumb-2" />
                  </div>
                  <p>{slide.body}</p>
                </article>

                {/* Sağ Sütun (Görseller) */}
                <div className="cs-image-column" style={styles.image}>
                  <img src={slide.hero} alt={slide.heading} />
                  <a href={slide.link} target="_blank" rel="noopener noreferrer" className="view-article">
                    View Article ↗
                  </a>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Bunlar, animasyonu tetikleyen görünmez kaydırma alanlarıdır */}
      {slides.slice(0, -1).map((_, index) => (
        <div
          key={`trigger-${index}`}
          ref={(el) => (triggerRefs.current[index] = el)}
          data-index={index}
          className="cs-trigger"
        />
      ))}
    </section>
  );
}