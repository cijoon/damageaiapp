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
  const initialFramesToLoad = 40; // Başlangıçta yüklenecek kare sayısı 40
  // <<< DEĞİŞTİRİLDİ: imagePath fonksiyonu yeni dosya adlandırma formatına göre güncellendi
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}_result.webp`;

  const [images, setImages] = useState(Array(totalFrames).fill(null));
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // % göstergesi

  useEffect(() => {
    let isCancelled = false;
    let loadedInitialCount = 0; // Başlangıç (ilk 40) kareleri için yüklenen sayacı

    const preloadInitialFrames = async () => {
      const tempImages = [...images];
      const initialImagePromises = [];

      for (let i = 0; i < initialFramesToLoad; i++) {
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        const loadPromise = img.decode()
          .catch(() => { /* decode hatasını yoksay */ })
          .finally(() => {
            if (!isCancelled) {
              tempImages[i] = img;
              loadedInitialCount++;
              setProgress(Math.round((loadedInitialCount / initialFramesToLoad) * 100));
            }
          });
        initialImagePromises.push(loadPromise);
      }

      await Promise.all(initialImagePromises);

      if (!isCancelled) {
        setImages(tempImages);
        setLoading(false); // İlk 40 görsel yüklendikten sonra preloader'ı hemen kapat

        preloadRemainingFrames(tempImages, loadedInitialCount); // Arka planda kalanları yükle
      }
    };

    const preloadRemainingFrames = async (currentImages, startingLoadedCount) => {
      const tempImages = [...currentImages];

      for (let i = startingLoadedCount; i < totalFrames; i++) {
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        try {
          await img.decode();
        } catch (_) {
          // Hata durumunda bile yer tutsun
        }

        tempImages[i] = img;
        if (!isCancelled) {
            setImages([...tempImages]);
        }
      }
    };

    preloadInitialFrames();

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