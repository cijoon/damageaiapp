// DOSYA ADI: src/components/ImageSequenceSection.jsx

import React, { useRef, useEffect, useState } from 'react';
import './ImageSequenceSection.css';

export default function ImageSequenceSection({ images }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIndexRef = useRef(0);
  const [fullTextToShow, setFullTextToShow] = useState(""); 
  const [currentSentenceDisplayLength, setCurrentSentenceDisplayLength] = useState(0); 
  const [isTextOverlayVisible, setIsTextOverlayVisible] = useState(false); // Metin kapsayıcısının genel görünürlüğü

  const totalFrames = images.length;

  // Cümle tanımı
  // lingerFrames artık kullanılmıyor, çünkü metin tamamen oluştuktan sonra kalıcı olacak.
  // Kaybolma sadece ters scroll ile olacak.
  // endFrame'i 1'den 10'a çıkardım ki "tek scrollda" biraz daha pürüzsüz görünen bir oluşum olsun.
  // İsterseniz 1 veya 2'ye geri çekebilirsiniz.
  const textTriggers = [
    { text: "EVERY CRACK TELLS A STORY OF REPAIR.", startFrame: 0, endFrame: 100 } 
  ];

  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const img = images[index];
    if (canvas && context && img) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    if (images.length === totalFrames) {
      drawFrame(0);
    }
  }, [images, totalFrames]);

  // Scroll dinleyicisi ile kare geçişi ve metin güncellemeleri
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || images.length < totalFrames) return;

    const handleWheel = (event) => {
      let currentFrame = frameIndexRef.current;
      let frameChanged = false;

      // Kaydırma yönüne göre kareyi güncelle
      if (event.deltaY > 0 && currentFrame < totalFrames - 1) { // İleriye kaydırma
        event.preventDefault();
        currentFrame++;
        frameChanged = true;
      } else if (event.deltaY < 0 && currentFrame > 0) { // Geriye kaydırma
        event.preventDefault();
        currentFrame--;
        frameChanged = true;
      }

      if (frameChanged) {
        frameIndexRef.current = currentFrame;
        drawFrame(currentFrame);

        let newFullText = "";
        let activeTrigger = null;
        let shouldOverlayBeVisible = false;

        // Sadece bir trigger olduğu varsayımıyla (textTriggers dizisi tek elemanlı)
        const trigger = textTriggers[0]; 
        
        // Metin tetikleyicisinin genel aralığı: startFrame'den itibaren.
        // Metin oluşmaya başladığı andan itibaren genel overlay görünür olmalı.
        if (currentFrame >= trigger.startFrame) {
            newFullText = trigger.text;
            activeTrigger = trigger;
            shouldOverlayBeVisible = true;
        }

        // Eğer tam metin değiştiyse (ki bu senaryoda sadece bir kez olacak)
        if (newFullText !== fullTextToShow) {
          setFullTextToShow(newFullText);
          // Metin ilk kez ayarlandığında karakter sayısını sıfırlama, animasyon başlangıcına bırak.
        }

        // Genel overlay görünürlük durumunu güncelle
        if (shouldOverlayBeVisible !== isTextOverlayVisible) {
          setIsTextOverlayVisible(shouldOverlayBeVisible);
        }

        // Karakter animasyonu ve görünürlük mantığı
        if (activeTrigger && fullTextToShow) {
            const textLength = fullTextToShow.length;
            const animationStartFrame = activeTrigger.startFrame;
            const typingEndFrame = activeTrigger.endFrame; 

            let calculatedDisplayLength = 0;

            if (currentFrame < animationStartFrame) {
                // Daha başlangıç karesine gelinmedi
                calculatedDisplayLength = 0;
            } else if (currentFrame >= animationStartFrame && currentFrame <= typingEndFrame) {
                // YAZMA/OLUŞMA AŞAMASI (harfler tek tek belirir/kaybolur)
                const typingDuration = typingEndFrame - animationStartFrame;
                if (typingDuration > 0) {
                    const framesIntoTyping = currentFrame - animationStartFrame;
                    let progressPercentage = framesIntoTyping / typingDuration;
                    progressPercentage = Math.max(0, Math.min(1, progressPercentage)); // 0-1 aralığında tut
                    calculatedDisplayLength = Math.round(progressPercentage * textLength);
                } else {
                    calculatedDisplayLength = textLength; // Süre 0 ise anında tam göster
                }
            } else { // currentFrame > typingEndFrame
                // METİN TAMAMEN OLUŞTU VE KALICI AŞAMA (ileriye kaydırıldıkça görünür kalır)
                calculatedDisplayLength = textLength; // Metin tamamen görünür kalsın
            }
            
            setCurrentSentenceDisplayLength(calculatedDisplayLength);

        } else {
           // Aktif trigger yoksa, karakter sayısını sıfırla
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
      {/* fullTextToShow veya currentSentenceDisplayLength > 0 olduğunda overlay'i render et */}
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