// DOSYA ADI: src/App.jsx

import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen/LoadingScreen'; // LoadingScreen bileşenini ekledik

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
  // Yükleme ekranının görünürlüğünü kontrol eden yeni state
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
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
              // Resim yükleme ilerlemesini burada takip edebilirsiniz ama
              // loading ekranı süresinden bağımsız olacaktır.
            }
          });
        imageLoadPromises.push(loadPromise);
      }

      await Promise.all(imageLoadPromises);

      if (!isCancelled) {
        setImages(tempImages);
        // Resimler yüklense bile, loading ekranının 5 saniye beklemesini sağlayacağız.
        // Bu yüzden burada doğrudan setShowLoadingScreen(false) demiyoruz.
      }
    };

    preloadAllFrames();

    return () => {
      isCancelled = true;
    };
  }, []);

  // LoadingScreen bileşeninin 5 saniye sonra kendini tamamlaması için bir callback fonksiyonu
  const handleLoadingScreenComplete = () => {
    setShowLoadingScreen(false); // 5 saniye dolduğunda loading ekranını gizle
  };

  return (
    <DeviceProvider>
      {showLoadingScreen && (
        <LoadingScreen onLoadingComplete={handleLoadingScreenComplete} />
      )}
      {!showLoadingScreen && (
        <MainContent images={images} />
      )}
    </DeviceProvider>
  );
}