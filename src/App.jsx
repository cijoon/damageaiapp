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
  // <<< DEĞİŞTİRİLDİ: initialFramesToLoad kaldırıldı, tüm görseller yüklenecek
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}_result.webp`;

  const [images, setImages] = useState(Array(totalFrames).fill(null));
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // % göstergesi

  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0; // Toplam yüklenen kare sayısı

    const preloadAllFrames = async () => {
      const tempImages = Array(totalFrames).fill(null);
      const imageLoadPromises = [];

      for (let i = 0; i < totalFrames; i++) { // Tüm kareler için döngü
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        const loadPromise = img.decode()
          .catch(() => { /* decode hatasını yoksay */ })
          .finally(() => {
            if (!isCancelled) {
              tempImages[i] = img;
              loadedCount++;
              // <<< DEĞİŞTİRİLDİ: Progress tüm karelerin yüklenmesini yansıtacak
              setProgress(Math.round((loadedCount / totalFrames) * 100));
            }
          });
        imageLoadPromises.push(loadPromise);
      }

      // Tüm görsellerin yüklenmesini/çözümlenmesini bekle
      await Promise.all(imageLoadPromises);

      if (!isCancelled) {
        setImages(tempImages);
        setLoading(false); // <<< DEĞİŞTİRİLDİ: Tüm görseller yüklendikten sonra preloader'ı kapat
      }
    };

    preloadAllFrames();

    return () => {
      isCancelled = true;
    };
  }, []); // Sadece ilk mount

  return (
    <DeviceProvider>
      <MainContent images={images} loading={loading} progress={progress} />
    </DeviceProvider>
  );
}