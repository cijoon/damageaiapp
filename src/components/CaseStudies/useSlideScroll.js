// DOSYA ADI: src/components/CaseStudies/useSlideScroll.js

import { useEffect, useRef, useState } from "react";

export default function useSlideScroll(slideCount) {
  const triggerRefs = useRef([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveSlide(index + 1);
          }
        });
      },
      { threshold: 0.6 } // Tetikleyici ekranın %60'ına gelince çalışır
    );

    triggerRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [slideCount]);

  const getSlideStyles = (index) => {
    // Sol Sütun (Metin) Animasyonu
    let textTransform = 'translateY(100%)';
    if (index === activeSlide) {
      textTransform = 'translateY(0)';
    } else if (index === activeSlide - 1) {
      textTransform = 'translateY(-100%)';
    }

    // Sağ Sütun (Görsel) Animasyonu
    let imageTransform = 'translateY(100%)';
    if (index <= activeSlide) {
      imageTransform = 'translateY(0)';
    }

    return {
      text: { transform: textTransform },
      image: { transform: imageTransform, zIndex: index + 1 }, // zIndex üst üste binmeyi sağlar
    };
  };

  return { triggerRefs, getSlideStyles };
}