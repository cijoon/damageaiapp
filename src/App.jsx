// DOSYA ADI: src/App.jsx

import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen/LoadingScreen.jsx'; // .jsx uzantısını ekledik

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
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // useDevice hook'unu App bileşeninde kullanıyoruz
  const { isMobile } = useDevice(); // <-- BURASI YENİ EKLENDİ

  useEffect(() => {
    // Eğer mobil cihazdaysak, loading ekranını hemen gizle
    if (isMobile) {
      setShowLoadingScreen(false);
      return; // Mobilse preload işlemine gerek yok, çünkü ImageSequenceSection da gösterilmiyor
    }

    // Mobil değilsek ve yükleme ekranı gösteriliyorsa, resimleri yükle
    let isCancelled = false;
    let loadedCount = 0;

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
              loadedCount++;
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
  }, [isMobile]); // isMobile değiştiğinde useEffect'i tekrar çalıştır

  const handleLoadingScreenComplete = () => {
    setShowLoadingScreen(false);
  };

  return (
    <DeviceProvider>
      {/* Sadece mobil değilsek VE showLoadingScreen true ise LoadingScreen'i göster */}
      {!isMobile && showLoadingScreen && (
        <LoadingScreen onLoadingComplete={handleLoadingScreenComplete} />
      )}

      {/* Eğer mobilsek VEYA showLoadingScreen false ise MainContent'i göster */}
      {(isMobile || !showLoadingScreen) && (
        <MainContent images={images} />
      )}
    </DeviceProvider>
  );
}