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
  if (loading && !isMobile) { // Mobil olmayan cihazlarda yükleme ekranını göster
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
  const initialFramesToLoad = 20; // İlk yüklenecek kare sayısı
  const minPreloaderDisplayTime = 1500; // <<< YENİ EKLEDİK: Minimum 1.5 saniye yükleme ekranı gösterilecek
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}.webp`; // .webp uzantısını kullanmayı unutmayın!

  const [images, setImages] = useState(Array(totalFrames).fill(null));
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // % göstergesi

  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    const preloadInitialFrames = async () => {
      const tempImages = [...images];
      const imageLoadPromises = [];

      for (let i = 0; i < initialFramesToLoad; i++) {
        if (isCancelled) return; // Yükleme iptal edildiyse dur

        const img = new Image();
        img.src = imagePath(i);
        
        // Her resmin yüklenmesi için bir Promise oluştur
        const loadPromise = img.decode()
          .catch(() => { /* decode hatasını yoksay */ })
          .finally(() => {
            if (!isCancelled) {
              tempImages[i] = img; // Yüklenen resmi doğru indekse yerleştir
              loadedCount++;
              // İlerleme çubuğu sadece ilk karelerin yüklemesini yansıtır
              setProgress(Math.round((loadedCount / initialFramesToLoad) * 100));
            }
          });
        imageLoadPromises.push(loadPromise);
      }

      // Minimum bekleme süresi için bir Promise oluştur
      const minTimePromise = new Promise(resolve => setTimeout(resolve, minPreloaderDisplayTime)); //

      // Hem resimlerin yüklenmesini hem de minimum sürenin dolmasını bekle
      await Promise.all([...imageLoadPromises, minTimePromise]); //

      if (!isCancelled) {
        setImages(tempImages); // İlk yüklenen kareleri state'e kaydet
        setLoading(false); // Preloader'ı kapat

        // Arka planda kalan resimleri yüklemeye başla
        preloadRemainingFrames(tempImages, loadedCount);
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
            setImages([...tempImages]); // Yeni bir dizi oluşturarak state güncellemesini tetikle
        }
      }
    };

    preloadInitialFrames();

    return () => {
      isCancelled = true;
    };
  }, []); // Yalnızca ilk mount

  return (
    <DeviceProvider>
      <MainContent images={images} loading={loading} progress={progress} />
    </DeviceProvider>
  );
}