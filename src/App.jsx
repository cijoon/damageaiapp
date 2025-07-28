// DOSYA ADI: src/App.jsx

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import LoadingScreen from './components/LoadingScreen/LoadingScreen.jsx';

import Header from './components/Header';
import IntroSection from './components/IntroSection';
import ImageSequenceSection from './components/ImageSequenceSection'; // ImageSequenceSection'ı import et

// Diğer ağır bileşenleri lazy yüklüyoruz
const LazyPhilosophySection = lazy(() => import('./components/PhilosophySection/PhilosophySection'));
const LazyFinalCaseStudies = lazy(() => import('./components/FinalCaseStudies/FinalCaseStudies'));
const LazyPhoneShowcaseSection = lazy(() => import('./components/PhoneShowcaseSection'));
const LazyExperimentsSection = lazy(() => import('./components/ExperimentsSection'));
const LazyFooter = lazy(() => import('./components/Footer'));

import { DeviceProvider, useDevice } from "./contexts/DeviceContext"; // DeviceProvider import'ını kontrol ettik


// MainContent bileşeni - artık dışarıda koşullu render etmiyoruz,
// içindeki bileşenler kendi mobil render kararlarını verecek
function MainContent({ images, onMobileStatusChange, onVideoReady, introSectionRef }) {
  const { isMobile } = useDevice(); // useDevice burada güvenle kullanılabilir

  useEffect(() => {
    // isMobile değeri değiştiğinde veya bileşen ilk render edildiğinde App'e bildiriyoruz
    if (onMobileStatusChange) {
      onMobileStatusChange(isMobile);
    }
  }, [isMobile, onMobileStatusChange]);

  // Mobil ise intro video oynatma veya scroll etme gibi davranışlar burada kontrol edilebilir
  // Örneğin, mobil ise intro videoyu farklı başlatabilirsiniz.

  return (
    <>
      <Header />
      <main>
        <IntroSection onVideoReady={onVideoReady} ref={introSectionRef} />
        {/* ImageSequenceSection sadece mobil değilse render edilecek */}
        {!isMobile && <ImageSequenceSection images={images} />} {/* App'den gelen images'i kullanıyor */}

        {/* Diğer bölümler için Lazy Loading ve Suspense */}
        <Suspense fallback={<div>Loading content...</div>}>
          <LazyFinalCaseStudies />
        </Suspense>

        {!isMobile && ( // PhilosophySection da mobilde gizli kalmaya devam ediyor
          <Suspense fallback={<div>Loading philosophy...</div>}>
            <LazyPhilosophySection />
          </Suspense>
        )}

        <Suspense fallback={<div>Loading showcase...</div>}>
          <LazyPhoneShowcaseSection />
        </Suspense>

        <Suspense fallback={<div>Loading experiments...</div>}>
          <LazyExperimentsSection />
        </Suspense>

        <Suspense fallback={<div>Loading footer...</div>}>
          <LazyFooter />
        </Suspense>
      </main>
    </>
  );
}


export default function App() {
  const totalFrames = 135;
  const imagePath = (frame) =>
    `/catlak-animasyon/Pre-comp 1_${String(frame).padStart(5, '0')}.webp`;

  const [preloadedImageSequenceImages, setPreloadedImageSequenceImages] = useState(Array(totalFrames).fill(null));
  const [imageSequenceLoadProgress, setImageSequenceLoadProgress] = useState(0);

  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [isMobileDetected, setIsMobileDetected] = useState(false); // Mobile algılama state'i

  const mainVideoRef = useRef(null);
  const introSectionMainRef = useRef(null);

  const handleMobileStatusChange = (status) => {
    setIsMobileDetected(status);
  };

  const handleMainVideoReady = (videoElement) => {
    mainVideoRef.current = videoElement;
    if (mainVideoRef.current) {
      mainVideoRef.current.pause();
      mainVideoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    // Eğer mobil bir cihazdaysak, preload işlemine ve loading ekranına gerek yok.
    // Mobil durum App ilk render edildiğinde handleMobileStatusChange tarafından set ediliyor.
    // Bu useEffect, isMobileDetected değiştiğinde tetikleniyor.
    if (isMobileDetected) {
      setShowLoadingScreen(false); // Mobilde loading ekranını kapat
      return; // Preload işlemine devam etme
    }

    // Mobil değilsek (masaüstü), preload işlemini başlat.
    let isCancelled = false;
    let loadedCount = 0;

    const preloadImageSequenceAssets = async () => {
      const tempImages = Array(totalFrames).fill(null);
      const imageLoadPromises = [];

      for (let i = 0; i < totalFrames; i++) {
        if (isCancelled) return;

        const img = new Image();
        img.src = imagePath(i);

        const loadPromise = new Promise((resolve, reject) => {
          img.onload = () => {
            if (!isCancelled) {
              tempImages[i] = img;
              loadedCount++;
              setImageSequenceLoadProgress(Math.floor((loadedCount / totalFrames) * 100));
              resolve();
            } else {
              reject(new Error("Yükleme iptal edildi"));
            }
          };
          img.onerror = (e) => {
            console.error(`Resim yüklenirken hata: ${img.src}`, e);
            if (!isCancelled) {
               tempImages[i] = null;
               loadedCount++;
               setImageSequenceLoadProgress(Math.floor((loadedCount / totalFrames) * 100));
               resolve();
            } else {
               reject(new Error("Yükleme iptal edildi"));
            }
          };
        });
        imageLoadPromises.push(loadPromise);
      }

      await Promise.allSettled(imageLoadPromises);

      if (!isCancelled) {
        setPreloadedImageSequenceImages(tempImages);
        // Tüm resimler yüklendiğinde loading ekranını kapat.
        setShowLoadingScreen(false);
      }
    };

    // Mobil değilsek preload işlemini başlat
    preloadImageSequenceAssets();

    return () => {
      isCancelled = true;
    };
  }, [isMobileDetected]); // isMobileDetected değiştiğinde tekrar çalışır

  const handleLoadingScreenComplete = () => {
    // Bu fonksiyon, LoadingScreen'ın progress'i 100 olduğunda çağrılıyor.
    // showLoadingScreen zaten preload işlemi bittiğinde false oluyor.

    // Ana videoyu baştan başlat ve oynat
    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime = 0;
      const playPromise = mainVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {}).catch(error => {
          console.error("Video oynatılamadı:", error);
        });
      }
    }

    // IntroSection'a kaydır
    setTimeout(() => {
      if (introSectionMainRef.current) {
        introSectionMainRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <DeviceProvider>
      {/* LoadingScreen'i sadece mobil değilse VE hala gösterilmesi gerekiyorsa render et */}
      {!isMobileDetected && showLoadingScreen && (
        <LoadingScreen
          onLoadingComplete={handleLoadingScreenComplete}
          progress={imageSequenceLoadProgress}
        />
      )}

      {/* MainContent her zaman render ediliyor, içindeki mantık sayesinde
          mobil cihazlarda ImageSequenceSection gibi bileşenler gizleniyor.
          Ancak, loading ekranı bitene kadar veya mobil değilse opacity gibi CSS ile gizleyebilirsiniz.
          Şu anki haliyle, mobil değilse ve loading bitmediyse MainContent görünür ama loading ekranı üstünde.
          Mobil ise direkt görünür.
      */}
      <MainContent
        images={preloadedImageSequenceImages}
        onMobileStatusChange={handleMobileStatusChange}
        onVideoReady={handleMainVideoReady}
        introSectionRef={introSectionMainRef}
      />
    </DeviceProvider>
  );
}