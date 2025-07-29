// DOSYA ADI: src/App.jsx
// ImageSequenceSection ve ilgili tüm kodlar kaldırıldı.

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Header from './components/Header';
import IntroSection from './components/IntroSection';
// import ImageSequenceSection from './components/ImageSequenceSection'; // <-- KALDIRILDI

// Google Analytics'i index.html üzerinden eklediğiniz için bu satırlara gerek kalmadı.
// import ReactGA from "react-ga4"; // <-- KALDIRILDI

// Diğer ağır bileşenleri lazy yüklüyoruz
const LazyPhilosophySection = lazy(() => import('./components/PhilosophySection/PhilosophySection'));
const LazyFinalCaseStudies = lazy(() => import('./components/FinalCaseStudies/FinalCaseStudies'));
const LazyPhoneShowcaseSection = lazy(() => import('./components/PhoneShowcaseSection'));
const LazyExperimentsSection = lazy(() => import('./components/ExperimentsSection'));
const LazyFooter = lazy(() => import('./components/Footer'));

import { DeviceProvider, useDevice } from "./contexts/DeviceContext";


// MainContent bileşeni, gereksiz proplar temizlendi.
function MainContent({ onVideoReady, introSectionRef }) {
 const { isMobile } = useDevice();

 return (
   <>
     <Header />
     <main>
       <IntroSection onVideoReady={onVideoReady} ref={introSectionRef} />

       {!isMobile && (
         <Suspense fallback={<div>Loading philosophy...</div>}>
           <LazyPhilosophySection />
         </Suspense>
       )}

       <Suspense fallback={<div>Loading content...</div>}>
         <LazyFinalCaseStudies />
       </Suspense>

       {/* ImageSequenceSection buradan kaldırıldı */}

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


// Uygulamanın ana mantığını içeren bileşen
function AppContent() {
  const { isMobile } = useDevice();

  // --- ImageSequence için resim yükleme mantığı kaldırıldı ---
  // const totalFrames = 135;
  // const imagePath = (frame) => ...
  // const [preloadedImageSequenceImages, setPreloadedImageSequenceImages] = useState(...);
  // --- Resim yükleme mantığı sonu ---

  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const mainVideoRef = useRef(null);
  const introSectionMainRef = useRef(null);

  const handleMainVideoReady = (videoElement) => {
    mainVideoRef.current = videoElement;
    if (mainVideoRef.current) {
      if (isMobile) {
          const playPromise = mainVideoRef.current.play();
          if (playPromise !== undefined) {
              playPromise.catch(error => {
                  console.warn("Mobilde video otomatik oynatılamadı, kullanıcı etkileşimi gerekebilir:", error);
              });
          }
      } else {
        mainVideoRef.current.pause();
        mainVideoRef.current.currentTime = 0;
      }
    }
  };

  // --- ImageSequence için resim yükleme useEffect'i kaldırıldı ---
  // useEffect(() => {
  //   const preloadImageSequenceAssets = async () => { ... };
  //   preloadImageSequenceAssets();
  // }, []);
  // --- useEffect sonu ---


  // Yükleme ekranı zamanlayıcısı
  useEffect(() => {
    if (!isMobile) {
        const timer = setTimeout(() => {
            setShowLoadingScreen(false);
        }, 3000);
        return () => clearTimeout(timer);
    } else {
        setShowLoadingScreen(false);
    }
  }, [isMobile]);

  // Google Analytics'i index.html'den eklediğiniz için bu useEffect'e gerek kalmadı.
  // useEffect(() => {
  //   ReactGA.initialize(...);
  // }, []);


  return (
    <>
      {showLoadingScreen && !isMobile && <LoadingScreen />}
      {!showLoadingScreen && (
        <MainContent
          // images prop'u kaldırıldı
          onVideoReady={handleMainVideoReady}
          introSectionRef={introSectionMainRef}
        />
      )}
    </>
  );
}

// Orijinal App export'u
export default function App() {
  return (
    <DeviceProvider>
      <AppContent />
    </DeviceProvider>
  );
}
