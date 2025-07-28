// DOSYA ADI: src/App.jsx

import React, { useState, useEffect } from 'react';
// LoadingScreen artık kullanılmadığı için import satırını sildik
// import LoadingScreen from './components/LoadingScreen/LoadingScreen';

import Header from './components/Header';
import IntroSection from './components/IntroSection';
import PhilosophySection from './components/PhilosophySection/PhilosophySection';
import FinalCaseStudies from './components/FinalCaseStudies/FinalCaseStudies';
import PhoneShowcaseSection from './components/PhoneShowcaseSection';
import ImageSequenceSection from './components/ImageSequenceSection';
import ExperimentsSection from './components/ExperimentsSection';
import Footer from './components/Footer';
import { DeviceProvider, useDevice } from "./contexts/DeviceContext";

function MainContent({ images }) {
  const { isMobile } = useDevice();
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
  // Yükleme ekranının görünürlüğünü kontrol eden state artık gerekli değil
  // const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const preloadAllFrames = async () => {
      const tempImages = Array(totalFrames).fill(null);
      const imageLoadPromises = [];

      for (let i = 0; i < totalFrames; i++) {
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        const loadPromise = img.decode()
          .catch(() => { /* decode hatasını yoksay */ })
          .finally(() => {
            if (!isCancelled) {
              tempImages[i] = img;
              // loadedCount artık kullanılmadığı için kaldırıldı
            }
          });
        imageLoadPromises.push(loadPromise);
      }

      await Promise.all(imageLoadPromises);

      if (!isCancelled) {
        setImages(tempImages);
      }
    };

    preloadAllFrames();

    return () => {
      isCancelled = true;
    };
  }, []);

  // LoadingScreen ile ilgili callback fonksiyonu artık gerekli değil
  // const handleLoadingScreenComplete = () => {
  //   setShowLoadingScreen(false);
  // };

  return (
    <DeviceProvider>
      {/* AppContent bileşeni artık gerekli değil, doğrudan MainContent'i render ediyoruz */}
      <MainContent images={images} />
    </DeviceProvider>
  );
}

// AppContent bileşeni ve içindeki LoadingScreen koşullu render mantığı tamamen kaldırıldı.