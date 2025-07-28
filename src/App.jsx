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

  // useDevice hook'unu App bileşeni içinde kullanabilmek için DeviceProvider'ın Child'ı olması gerekir.
  // Bu yüzden isMobile state'ini doğrudan App bileşeninde kontrol etmek yerine
  // LoadingScreen'i koşullu olarak render ederken MainContent'e DeviceProvider'ı sarmalayacağız.
  // Veya daha iyisi, App bileşeni içinde isMobile durumunu elde edip loading ekranını buna göre göstermeliyiz.

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

  // LoadingScreen bileşeninin 5 saniye sonra kendini tamamlaması için bir callback fonksiyonu
  const handleLoadingScreenComplete = () => {
    setShowLoadingScreen(false); // 5 saniye dolduğunda loading ekranını gizle
  };

  return (
    <DeviceProvider>
      {/* DeviceProvider içinde useDevice hook'unu kullanarak isMobile'ı alıyoruz */}
      {/* showLoadingScreen durumunu kontrol etmeden önce isMobile durumunu kontrol edeceğiz */}
      <AppContent
        showLoadingScreen={showLoadingScreen}
        handleLoadingScreenComplete={handleLoadingScreenComplete}
        images={images}
      />
    </DeviceProvider>
  );
}

// Yeni bir bileşen oluşturarak App bileşeninin içindeki mantığı ayırıyoruz.
// Böylece useDevice hook'unu kullanabiliriz.
function AppContent({ showLoadingScreen, handleLoadingScreenComplete, images }) {
  const { isMobile } = useDevice(); // isMobile durumunu buradan alıyoruz

  return (
    <>
      {/* Sadece mobilde değilse ve showLoadingScreen true ise LoadingScreen'i göster */}
      {showLoadingScreen && !isMobile ? (
        <LoadingScreen onLoadingComplete={handleLoadingScreenComplete} />
      ) : (
        // Eğer LoadingScreen gösterilmiyorsa veya mobil ise MainContent'i göster
        <MainContent images={images} />
      )}
    </>
  );
}