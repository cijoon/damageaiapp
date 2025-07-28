// DOSYA ADI: src/App.jsx

import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import Header from './components/Header';
import IntroSection from './components/IntroSection';
import PhilosophySection from './components/PhilosophySection/PhilosophySection';
import FinalCaseStudies from './components/FinalCaseStudies/FinalCaseStudies';
import PhoneShowcaseSection from './components/PhoneShowcaseSection';
import ImageSequenceSection from './components/ImageSequenceSection';
import ExperimentsSection from './components/ExperimentsSection';
import Footer from './components/Footer';
import { DeviceProvider, useDevice } from "./contexts/DeviceContext";

function MainContent({ images, loading, progress }) {
  const { isMobile } = useDevice();
  if (loading && !isMobile) {
    return <Preloader progress={progress} />;
  }
  return (
    <>
      <Header />
      <main>
        <IntroSection />
        {/* Sadece mobilde değilse ImageSequenceSection'ı göster */}
        {!isMobile && <ImageSequenceSection images={images} />}
        <FinalCaseStudies />
        {/* Mobilde PhilosophySection gösterilmeyecek */}
        {!isMobile && <PhilosophySection />}
        <PhoneShowcaseSection />
        <ExperimentsSection />
        <Footer />
      </main>
    </>
  );
}

export default function App() {
  const totalFrames = 135;
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}.webp`;

  const [images, setImages] = useState(Array(totalFrames).fill(null));
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // % göstergesi

  useEffect(() => {
    let isCancelled = false;

    const preloadAllFrames = async () => {
      const tempImages = Array(totalFrames).fill(null);
      const imageLoadPromises = [];
      let loadedCount = 0;

      for (let i = 0; i < totalFrames; i++) {
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        const loadPromise = img.decode()
          .catch(() => { /* decode hatasını yoksay */ })
          .finally(() => {
            if (!isCancelled) {
              tempImages[i] = img;
              loadedCount++;

              // <<< DEĞİŞTİRİLDİ: İlerleme çubuğu mantığı
              const actualProgress = (loadedCount / totalFrames) * 100;
              let displayProgress;

              if (loadedCount < totalFrames) { // Tüm görseller henüz yüklenmediyse
                  // Gerçek ilerlemeyi %70'e oranla ölçeklendir
                  // Örn: gerçek ilerleme %50 ise, gösterilen %35 olur (%50 * 0.70)
                  displayProgress = Math.round(actualProgress * 0.70);
                  // Ancak gösterilen ilerleme %70'i geçemez, böylece "bekleme" efekti oluşur
                  displayProgress = Math.min(displayProgress, 70); 
              } else { // Tüm görseller yüklendiğinde
                  displayProgress = 100; // İlerleme çubuğunu %100'e tamamla
              }
              setProgress(displayProgress);
            }
          });
        imageLoadPromises.push(loadPromise);
      }

      await Promise.all(imageLoadPromises);

      if (!isCancelled) {
        setImages(tempImages);
        setLoading(false);
      }
    };

    preloadAllFrames();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <DeviceProvider>
      <MainContent images={images} loading={loading} progress={progress} />
    </DeviceProvider>
  );
}