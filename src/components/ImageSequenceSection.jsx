// DOSYA ADI: src/components/ImageSequenceSection.jsx

import React, { useRef, useEffect, useState } from 'react';
import './ImageSequenceSection.css';

export default function ImageSequenceSection({ images }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIndexRef = useRef(0);
  const [fullTextToShow, setFullTextToShow] = useState("");
  const [currentSentenceDisplayLength, setCurrentSentenceDisplayLength] = useState(0);
  const [isTextOverlayVisible, setIsTextOverlayVisible] = useState(false);

  // *** YENİ: Başlangıç çiziminin yapılıp yapılmadığını takip etmek için useRef ***
  const initialDrawDoneRef = useRef(false);

  // *** YENİ: Kaydırma hassasiyetini kontrol etmek için yeni bir useRef ***
  // Bu değer ne kadar yüksekse, animasyon o kadar yavaşlar (her kare için daha fazla kaydırma gerekir).
  const scrollSensitivityRef = useRef(15); // Her 15 piksel kaydırmada bir kare ilerle

  // *** YENİ: Toplam kaydırma miktarını takip etmek için useRef ***
  const currentScrollAmountRef = useRef(0);

  // *** YENİ: Animasyonun sonuna gelindiğinde dışarı kaydırmak için ek eşik ***
  const exitScrollThresholdRef = useRef(50); // Animasyon bitince 50 piksel daha kaydırılırsa serbest bırak


  const totalFrames = images.length;

  const textTriggers = [
    { text: "EVERY CRACK TELLS A STORY OF REPAIR.", startFrame: 0, endFrame: 100 }
  ];

  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const img = images[index]; // img burada null veya yüklü bir Image nesnesi olabilir
    if (canvas && context && img) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    // Eğer img null ise (yani henüz yüklenmediyse), canvas'ı temizlemez ve önceki kareyi gösterir.
    // Bu, yüklenme devam ederken geçişlerde takılma olmamasını sağlar.
  };

  // *** BU useEffect DEĞİŞTİ: Sadece başlangıç çizimini bir kez yapacak ***
  useEffect(() => {
    // Eğer images dizisi boş değilse (yani en azından ilk kareler yüklendiğinde)
    // ve ilk kare (images[0]) yüklü ise
    // VE henüz başlangıç çizimi yapılmadıysa...
    if (images.length > 0 && images[0] && !initialDrawDoneRef.current) {
      drawFrame(0); // İlk kareyi çiz
      initialDrawDoneRef.current = true; // Başlangıç çiziminin yapıldığını işaretle
    }
    // Bu useEffect'in bağımlılıkları arasına images'ı koyduk ki, App.jsx'ten gelen ilk görseller yüklendiğinde tetiklensin.
  }, [images]); // images'ın ilk kez dolu gelmesiyle veya değişmesiyle tetiklenir


  // Scroll dinleyicisi ile kare geçişi ve metin güncellemeleri
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || images.length < totalFrames) return;

    const handleWheel = (event) => {
      let currentFrame = frameIndexRef.current;
      let frameChanged = false;
      let preventDefaultScroll = true; // Varsayılan olarak kaydırmayı engelle

      // Kaydırma miktarını biriktir
      currentScrollAmountRef.current += event.deltaY;

      // İleriye kaydırma
      if (event.deltaY > 0) {
        if (currentFrame < totalFrames - 1) {
          // Animasyon devam ederken
          if (currentScrollAmountRef.current >= scrollSensitivityRef.current) {
            currentFrame++;
            frameChanged = true;
            currentScrollAmountRef.current = 0; // Eşiği geçince sıfırla
          }
        } else {
          // Animasyon son kareye ulaştı, şimdi dışarı kaydırmaya izin ver
          if (currentScrollAmountRef.current >= exitScrollThresholdRef.current) {
            preventDefaultScroll = false; // Kaydırmayı serbest bırak
            currentScrollAmountRef.current = exitScrollThresholdRef.current; // Negatif birikmemesi için
          } else {
            preventDefaultScroll = true; // Henüz eşiği geçmediyse hala engelle
          }
        }
      } 
      // Geriye kaydırma
      else if (event.deltaY < 0) {
        if (currentFrame > 0) {
          // Animasyon devam ederken
          if (currentScrollAmountRef.current <= -scrollSensitivityRef.current) {
            currentFrame--;
            frameChanged = true;
            currentScrollAmountRef.current = 0; // Eşiği geçince sıfırla
          }
        } else {
          // Animasyon ilk kareye ulaştı, şimdi dışarı kaydırmaya izin ver
          if (currentScrollAmountRef.current <= -exitScrollThresholdRef.current) {
            preventDefaultScroll = false; // Kaydırmayı serbest bırak
            currentScrollAmountRef.current = -exitScrollThresholdRef.current; // Pozitif birikmemesi için
          } else {
            preventDefaultScroll = true; // Henüz eşiği geçmediyse hala engelle
          }
        }
      }

      if (preventDefaultScroll) {
        event.preventDefault(); // Sadece gerekli olduğunda default'u engelle
      }


      if (frameChanged) {
        frameIndexRef.current = currentFrame;
        drawFrame(currentFrame);

        let newFullText = "";
        let activeTrigger = null;
        let shouldOverlayBeVisible = false;

        const trigger = textTriggers[0];

        if (currentFrame >= trigger.startFrame) {
            newFullText = trigger.text;
            activeTrigger = trigger;
            shouldOverlayBeVisible = true;
        }

        if (newFullText !== fullTextToShow) {
          setFullTextToShow(newFullText);
        }

        if (shouldOverlayBeVisible !== isTextOverlayVisible) {
          setIsTextOverlayVisible(shouldOverlayBeVisible);
        }

        if (activeTrigger && fullTextToShow) {
            const textLength = fullTextToShow.length;
            const animationStartFrame = activeTrigger.startFrame;
            const typingEndFrame = activeTrigger.endFrame;

            let calculatedDisplayLength = 0;

            if (currentFrame < animationStartFrame) {
                calculatedDisplayLength = 0;
            } else if (currentFrame >= animationStartFrame && currentFrame <= typingEndFrame) {
                const typingDuration = typingEndFrame - animationStartFrame;
                if (typingDuration > 0) {
                    const framesIntoTyping = currentFrame - animationStartFrame;
                    let progressPercentage = framesIntoTyping / typingDuration;
                    progressPercentage = Math.max(0, Math.min(1, progressPercentage));
                    calculatedDisplayLength = Math.round(progressPercentage * textLength);
                } else {
                    calculatedDisplayLength = textLength;
                }
            } else { // currentFrame > typingEndFrame
                calculatedDisplayLength = textLength;
            }

            setCurrentSentenceDisplayLength(calculatedDisplayLength);

        } else {
           setCurrentSentenceDisplayLength(0);
        }
      }
    };

    section.addEventListener('wheel', handleWheel, { passive: false });
    return () => section.removeEventListener('wheel', handleWheel);
  }, [images, totalFrames, textTriggers, fullTextToShow, isTextOverlayVisible]);

  return (
    <section ref={sectionRef} className="sequence-section-locked">
      <canvas ref={canvasRef} width="1920" height="1080"></canvas>
      {(fullTextToShow || currentSentenceDisplayLength > 0) && (
        <div className={`sequence-text-overlay ${isTextOverlayVisible ? 'is-visible' : ''}`}>
          <p>
            {fullTextToShow.split('').map((char, index) => (
              <span
                key={index}
                className={`char ${index < currentSentenceDisplayLength ? 'is-char-visible' : ''}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </p>
        </div>
      )}
    </section>
  );
}